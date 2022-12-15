class ScreenshotHandler {
	/**Babylon scripts have to reference this outside of ScreenshotHandler, after creating a screenshot.*/
	screenshotData = [];

	startScreenshotsCr = function* () {
		this.screenshotData.length = 0;

		BABYLON.Tools.CreateScreenshotUsingRenderTarget(
			g_engine,
			g_camera,
			200,
			this.screenshotSuccess,
			"image/png",
			8,
			false,
			"1.png"
		);

		yield;

		BABYLON.Tools.CreateScreenshotUsingRenderTarget(
			g_engine,
			g_camera,
			200,
			this.screenshotSuccess,
			"image/png",
			8,
			false,
			"2.png"
		);

		yield;

		if (this.screenshotData.length > 0) this.zipAndSaveScreenshots();
	};

	screenshotSuccess(imageData) {
		// remove the first few chars of the data url string, which looks like:
		// "data:image/png;base64"
		let b64 = imageData.substring(22);

		// since this functino is called by Babylon, referencing 'this' throws an error.
		// reference the global var in index.js insted
		g_screenshotHandler.screenshotData.push(b64);
	}

	zipAndSaveScreenshots() {
		const zip = new JSZip();
		for (let i = 0; i < this.screenshotData.length; i++) {
			zip.file("sprites/" + i + ".png", this.screenshotData[i], {
				base64: true,
			});
		}

		zip.generateAsync({ type: "blob" }).then(function (content) {
			saveAs(content, "YourArcadian.zip");
		});
	}
}
