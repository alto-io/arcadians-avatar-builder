class ScreenshotHandler {
	screenshotData = [];

	startScreenshotsCr = function* (engine, scene, camera, animationGroup) {
		let config = g_config.spritesheet;
		this.screenshotData.length = 0;

		let prevBgColor = scene.clearColor;
		scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

		// 'to'' is the last frame of the currently playing animation
		// as in 'from -> to'
		let totalFrames = animationGroup.to;

		console.log("Total animation length: " + totalFrames + " frames.");
		// skip some frames, so we don't have to take all 60 frames of a 1 sec animation.
		let skipInterval = config.framesToSkip;
		console.log(
			"Skipping " + skipInterval + " frame/s after every screenshot..."
		);

		let skipCounter = skipInterval;

		for (let i = 0; i < totalFrames; i++) {
			let skipFrame = skipInterval > 0 && skipCounter < skipInterval;

			if (skipFrame) {
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
					width: config.sizeY,
					height: config.sizeX,
					precision: 1,
				},
				this.screenshotSuccess,
				"image/png"
			);
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
}
