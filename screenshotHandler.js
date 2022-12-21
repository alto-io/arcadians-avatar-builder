class ScreenshotHandler {
	CONFIG = g_config.spritesheet;

	/**Nested array, separating screenshot sets by animation*/
	allScreenshotData = [[]];
	prevBgColor;
	postProcess;

	/**Used by BABYLON screenshot API*/
	screenshotSet = [];

	startScreenshotsCr = function* (canvas, engine, scene, camera) {
		// wait for post processing to finish
		this.setupScreenshots(canvas, scene, camera);
		yield;
		yield;

		/* TO DO: figure out how to move all of the code in this for loop	*/
		/* to a new coroutine func that can yield to the next frame			*/

		// take screenshots of each targeted anim
		for (let animName of this.CONFIG.targetAnimations) {
			console.log("Taking screenshots of: " + animName);

			// wait for anim to play
			playAnim(animName);
			yield;
			yield;
			let animationGroup = g_animPrev;

			// for each animation, push the results to screenshotSet
			// when done. push screenshotSet to allScreenshotData
			this.screenshotSet = [];

			// 'to'' is the last frame of the currently playing animation
			// as in 'from -> to'
			let totalFrames = animationGroup.to;
			console.log("Total animation length: " + totalFrames + " frames.");

			// skip some frames, so we don't have to take all 60 frames of a 1 sec animation.
			let skipCounter = this.CONFIG.framesToSkip;
			console.log(
				"Skipping " + skipCounter + " frame/s after every screenshot..."
			);

			for (let i = 1; i <= totalFrames; i++) {
				let skipInterval = this.CONFIG.framesToSkip;
				let skipFrame = skipInterval > 0 && skipCounter < skipInterval;
				// force a screenshot on the last frame
				let isLastFrame = i == totalFrames;

				if (skipFrame && !isLastFrame) {
					skipCounter++;
					continue;
				}

				skipCounter = 0;

				// wait for the frame to load
				animationGroup.goToFrame(i);
				yield;

				BABYLON.Tools.CreateScreenshot(
					engine,
					camera,
					{
						width: this.CONFIG.sizeY,
						height: this.CONFIG.sizeX,
						precision: 1,
					},
					(imgData) =>
						g_screenshotHandler.screenshotSet.push(imgData),
					"image/png"
				);
			}

			console.log("Total sprite count: " + this.screenshotSet.length);
			this.allScreenshotData.push(this.screenshotSet);
		}

		// merge into a single png, zip, and save
		console.log("Total animation count: " + this.allScreenshotData.length);
		if (this.allScreenshotData.length > 0) this.zipAndSaveScreenshots();
		else console.error("Screenshots failed! No screenshots were taken.");

		// clear
		this.clearPostProcessing(scene);
	};

	setupScreenshots(canvas, scene, camera) {
		this.allScreenshotData.length = 0;

		this.prevBgColor = scene.clearColor;
		scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

		var postProcessScale = this.CONFIG.sizeX / canvas.width;
		this.postProcess = new BABYLON.PassPostProcess(
			"Scene copy",
			postProcessScale,
			camera,
			BABYLON.Texture.NEAREST_SAMPLINGMODE
		);
	}

	async zipAndSaveScreenshots() {
		// reposition screenshots so they appear side by side in the final image output
		// animations are grouped by row
		let arrangedImageData = [];
		for (
			let animIdx = 0;
			animIdx < this.allScreenshotData.length;
			animIdx++
		) {
			for (
				let imgIdx = 0;
				imgIdx < this.allScreenshotData[animIdx].length;
				imgIdx++
			) {
				arrangedImageData.push({
					src: this.allScreenshotData[animIdx][imgIdx],
					x: imgIdx * this.CONFIG.sizeX,
					y: animIdx * this.CONFIG.sizeY,
				});
			}
		}

		let longestSet = 0;
		for (let animData of this.allScreenshotData)
			if (animData.length > longestSet) longestSet = animData.length;

		let finalImage;
		await mergeImages(arrangedImageData, {
			width: longestSet * this.CONFIG.sizeX,
			height: this.allScreenshotData.length * this.CONFIG.sizeY,
		}).then((output) => {
			finalImage = output;
		});

		// remove the first few chars of the data url string, which looks like:
		// "data:image/png;base64,"
		let b64 = finalImage.substring(22);

		const zip = new JSZip();
		zip.file(
			this.CONFIG.spritesSubFolder + this.CONFIG.sheetfileName,
			b64,
			{
				base64: true,
			}
		);

		let zipName = this.CONFIG.zipFileName;
		zip.generateAsync({ type: "blob" }).then(function (content) {
			saveAs(content, zipName);
		});
	}

	clearPostProcessing(scene) {
		scene.clearColor = this.prevBgColor;
		this.postProcess.dispose();
	}
}
