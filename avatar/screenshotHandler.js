export class ScreenshotHandler {
	CONFIG;

	prevBgColor;
	postProcess;

	/**Used by BABYLON screenshot API*/
	screenshotSet = [];

	initialize(config) {
		CONFIG = config.spritesheet;
	}

	startScreenshotsCr = function* (canvas, engine, scene, camera) {
		// Nested array, separating screenshot sets by animation
		let allScreenshotData = [];

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

				if (skipFrame) {
					skipCounter++;
					continue;
				}

				skipCounter = 0;

				// wait for the frame to load
				animationGroup.goToFrame(i);
				yield;

				let waitForScreenshot = true;
				BABYLON.Tools.CreateScreenshot(
					engine,
					camera,
					{
						width: this.CONFIG.spriteWidth,
						height: this.CONFIG.spriteWidth,
						precision: 1,
					},
					(imgData) => {
						waitForScreenshot = false;
						g_screenshotHandler.screenshotSet.push(imgData);
					},
					"image/png"
				);

				// wait for screenshot api to finish
				while (waitForScreenshot) yield;
			}

			console.log("Total sprite count: " + this.screenshotSet.length);
			allScreenshotData.push(this.screenshotSet);
		}

		// merge into a single png, zip, and save
		console.log("Total animation count: " + allScreenshotData.length);
		if (allScreenshotData.length > 0)
			this.zipAndSaveScreenshots(allScreenshotData);
		else console.error("Screenshots failed! No screenshots were taken.");

		// clear
		this.clearPostProcessing(scene);
	};

	setupScreenshots(canvas, scene, camera) {
		this.prevBgColor = scene.clearColor;
		scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

		var postProcessScale = this.CONFIG.spriteWidth / canvas.width;
		this.postProcess = new BABYLON.PassPostProcess(
			"Scene copy",
			postProcessScale,
			camera,
			BABYLON.Texture.NEAREST_SAMPLINGMODE
		);
	}

	async zipAndSaveScreenshots(allScreenshotData) {
		const zip = new JSZip();

		let spritesheet = await this.mergeScreenshots(allScreenshotData);
		zip.file(
			this.CONFIG.spritesSubFolder + this.CONFIG.sheetfileName,
			spritesheet,
			{
				base64: true,
			}
		);

		let propertiesJson = this.createPropertiesJson(allScreenshotData);
		zip.file(
			this.CONFIG.spritesSubFolder + this.CONFIG.sheetJsonName,
			propertiesJson
		);

		let zipName = this.CONFIG.zipFileName;
		zip.generateAsync({ type: "blob" }).then(function (content) {
			saveAs(content, zipName);
		});
	}

	async mergeScreenshots(allScreenshotData) {
		// reposition screenshots so they appear side by side in the final image output
		// animations are grouped by row
		let arrangedImageData = [];
		for (let animIdx = 0; animIdx < allScreenshotData.length; animIdx++) {
			for (
				let imgIdx = 0;
				imgIdx < allScreenshotData[animIdx].length;
				imgIdx++
			) {
				arrangedImageData.push({
					src: allScreenshotData[animIdx][imgIdx],
					x: imgIdx * this.CONFIG.spriteWidth,
					y: animIdx * this.CONFIG.spriteHeight,
				});
			}
		}

		// base width of final image to the longest set of sprites
		let longestSet = 0;
		for (let animData of allScreenshotData)
			if (animData.length > longestSet) longestSet = animData.length;

		let finalImage;
		await mergeImages(arrangedImageData, {
			width: longestSet * this.CONFIG.spriteWidth,
			height: allScreenshotData.length * this.CONFIG.spriteHeight,
		}).then((output) => {
			finalImage = output;
		});

		// remove the first few chars of the data url string, which looks like:
		// "data:image/png;base64,"
		let b64 = finalImage.substring(22);

		return b64;
	}

	createPropertiesJson(allScreenshotData) {
		let properties = {
			spriteWidth: this.CONFIG.spriteWidth,
			spriteHeight: this.CONFIG.spriteHeight,
			framesPerSec:
				this.CONFIG.defaultFrameRate / (this.CONFIG.framesToSkip + 1),
			animations: [],
		};

		for (let i = 0; i < this.CONFIG.targetAnimations.length; i++) {
			// i should be one to one between targetAnimations and allScreenshotData
			let newEntry = {
				name: this.CONFIG.targetAnimations[i],
				rowIndex: i,
				totalFrames: allScreenshotData[i].length,
			};

			properties.animations.push(newEntry);
		}

		let json = JSON.stringify(properties);
		return json;
	}

	clearPostProcessing(scene) {
		scene.clearColor = this.prevBgColor;
		this.postProcess.dispose();
	}
}
