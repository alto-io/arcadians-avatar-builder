class BaseDisplay {
	name;

	constructor(name) {
		this.name = name;
	}

	populate() {}
	depopulate() {}
}

class UIManager {
	static #instance = null;

	#displays = [];

	static getInstance() {
		if (UIManager.#instance == null) {
			console.log("UIManager initialized");
			UIManager.#instance = new UIManager();
		}

		return UIManager.#instance;
	}

	static initialize() {
		var uiManager = UIManager.getInstance();

		var partsDisplay = new PartsDisplay("PartsDisplay");

		uiManager.#add(partsDisplay);
	}

	static showMenu(displayName) {
		var uiManager = UIManager.getInstance();

		uiManager.#displays.forEach((d) => {
			if (d.name == displayName) {
				d.populate();
			}
		});
	}

	static hideMenu(displayName) {
		var uiManager = UIManager.getInstance();

		uiManager.#displays.forEach((d) => {
			if (d.name == displayName) {
				d.depopulate();
			}
		});
	}

	#add(display) {
		var uiManager = UIManager.getInstance();

		uiManager.#displays.push(display);
	}
}
