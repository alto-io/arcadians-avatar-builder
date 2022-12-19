class ScreenshotHandler {
	SPRITE_SUB_FOLDER = "sprites/";
	ZIP_FILE_NAME = "YourArcadian.zip";

	/**Babylon scripts have to reference this outside of ScreenshotHandler, after creating a screenshot.*/
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

                const size = 128;

				BABYLON.Tools.CreateScreenshotUsingRenderTarget(
					engine,
					g_camera,
                    { height: size, width: size, precision: 1},
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
		// remove the first few chars of the data url string, which looks like:
		// "data:image/png;base64,"
		let b64 = imageData.substring(22);

		// since this function is called by Babylon, referencing 'this' throws an error.
		// reference the global var in index.js insted
		g_screenshotHandler.screenshotData.push(b64);
	}

	zipAndSaveScreenshots() {
		const zip = new JSZip();
		for (let i = 0; i < this.screenshotData.length; i++) {
			zip.file(
				this.SPRITE_SUB_FOLDER + i + ".png",
				this.screenshotData[i],
				{
					base64: true,
				}
			);
		}

		let zipName = this.ZIP_FILE_NAME;
		zip.generateAsync({ type: "blob" }).then(function (content) {
			saveAs(content, zipName);
		});

		console.log("Screenshots success!");
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
