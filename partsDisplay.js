class PartsDisplay extends BaseDisplay {
	#ui;
	#isInitialized = false;

	populate() {
		if (this.#isInitialized) return;

		this.#ui =
			BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
				"PartsDisplay"
			);

		// Initialize scroll viewer
		var sv = new BABYLON.GUI.ScrollViewer();
		sv.width = 0.9;
		sv.height = 0.9;
		sv.background = "white";
		this.#ui.addControl(sv);

		// Initialize grid
		var gd = new BABYLON.GUI.Grid();
		var columns = 5;
		var rows = 0;

		var arr = g_partsLoader.list["Bottom"];
		for (var i = 0; i < arr.length; i++) {
			if (i % columns == 0) rows++;
		}

		for (var i = 0; i < columns; i++) {
			gd.addColumnDefinition(150, true);
		}

		for (var i = 0; i < rows; i++) {
			gd.addRowDefinition(150, true);
		}

		gd.width = 0.9;
		gd.height = 75 * rows + "px";
		sv.addControl(gd);

		// Initialize the displays
		var index = 0;
		for (var y = 0; y < columns; y++) {
			for (var x = 0; x < rows; x++) {
				if (index >= arr.length) continue;

				let name = arr[index];
				var image = new BABYLON.GUI.Image(
					name,
					"/arcadian-parts/Male/Bottom/" + name
				);

				image.width = "150px";
				image.height = "150px";
				image.onPointerClickObservable.add(() => {
					g_partsLoader.replaceParts("Bottom", name);
					this.depopulate();
				});
				gd.addControl(image, y, x);

				index++;
			}
		}

		this.#isInitialized = true;
	}

	depopulate() {
		if (!this.#isInitialized) return;

		this.#isInitialized = false;
		this.#ui.dispose();
	}
}
