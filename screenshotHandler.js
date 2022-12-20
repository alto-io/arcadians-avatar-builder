class ScreenshotHandler {
	screenshotData = [];

	startScreenshotsCr = function* (engine, scene, animationGroup) {
		let prevBgColor = scene.clearColor;
		scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

		this.screenshotData.length = 0;

		let totalFrames = this.getTotalFramesOfAnim(engine, animationGroup);
		console.log("Total animation length: " + totalFrames + " frames.");

		// skip some frames, so we don't have to take all 60 frames of a 1 sec animation.
		// at 0, don't skip any.
		let skipInterval = 3; // 3 is a good value at 144fps. need to have this adapt to diff framerates
		console.log("Current Framerate: " + engine.getFps());
		console.log(
			"Skipping " + skipInterval + " frame/s after every screenshot..."
		);

		let skipCounter = 0;

		// wait for the anim to reset
		animationGroup.reset();
		yield;
		yield;

		let firstFrame = totalFrames;

		while (totalFrames >= 0) {
			// take screenshot of the first and last frame
			// totalFrames may not be a whole number
			let forceScreenshot = totalFrames == firstFrame || totalFrames < 1;
			let skipFrame = skipInterval > 0 && skipCounter < skipInterval;

			if (forceScreenshot || !skipFrame) {
				skipCounter = 0;

				let config = g_config.spritesheet;
				BABYLON.Tools.CreateScreenshotUsingRenderTarget(
					engine,
					g_camera,
					{
						height: config.sizeX,
						width: config.sizeY,
						precision: 1,
					},
					this.screenshotSuccess,
					"image/png",
					8,
					false,
					"screenshot.png"
				);
			} else {
				skipCounter++;
			}

			totalFrames--;
			yield;
		}
		console.log("Total sprite count: " + this.screenshotData.length);
		if (this.screenshotData.length > 0) this.zipAndSaveScreenshots();
		else console.error("Screenshots failed! No screenshots were taken.");

		scene.clearColor = prevBgColor;
	};

	screenshotSuccess(imageData) {
		// since this function is called by Babylon, referencing 'this' throws an error.
		// reference the global var in index.js insted
		g_screenshotHandler.screenshotData.push(imageData);
	}

	async zipAndSaveScreenshots() {
		let config = g_config.spritesheet;

		// reposition screenshots so they appear side by side in the final image output
		let arrangedImageData = [];
		for (let i = 0; i < this.screenshotData.length; i++) {
			arrangedImageData.push({
				src: this.screenshotData[i],
				x: i * config.sizeX,
				y: 0,
			});
		}

		let finalImage;
		await mergeImages(arrangedImageData, {
			width: this.screenshotData.length * config.sizeX,
			height: config.sizeY,
		}).then((output) => {
			finalImage = output;
		});

		// remove the first few chars of the data url string, which looks like:
		// "data:image/png;base64,"
		let b64 = finalImage.substring(22);

		const zip = new JSZip();
		zip.file(config.spritesSubFolder + config.sheetfileName, b64, {
			base64: true,
		});

		let zipName = config.zipFileName;
		zip.generateAsync({ type: "blob" }).then(function (content) {
			saveAs(content, zipName);
		});
	}

	getTotalFramesOfAnim(engine, animationGroup) {
		// 'to'' is the last frame of the currently playing animation
		// as in 'from -> to'
		let totalAnimFrames = animationGroup.to;
		//console.log("totalAnimFrames: " + totalAnimFrames);

		// my guess is the arcadian was animated at 60fps initially but idk
		let intendedFps = 60;
		//console.log("intendedFps: " + intendedFps);

		// match to fps
		// the anim is set to match the current frame rate
		let currFps = engine.getFps();
		//console.log("currFps: " + currFps);

		let estimatedFrames = (totalAnimFrames / intendedFps) * currFps;

		return estimatedFrames;
	}
}
