class KeyData {
	constructor(key) {
		this.key = key;
		this.isPressed = false;
	}

	key;
	/**For single press commands, so holding the key down has no effect*/
	isPressed;

	onKeyPress = null;
	onKeyHold = null;
	onKeyRelease = null;
}

class KeyboardHandler {
	allKeyData = [];

	/**
	 * Register a callback function for when a key is pressed.
	 * Won't be called multiple times if the key is held.
	 */
	registerOnKeyPress(key, callback) {
		if (!this.allKeyData.some((x) => x.key == key))
			this.allKeyData.push(new KeyData(key));

		let idx = this.allKeyData.findIndex((x) => x.key == key);

		if (this.allKeyData[idx].onKeyPress != null)
			console.warn(key, " already has a registered onKeyPress callback");

		this.allKeyData[idx].onKeyPress = callback;
	}

	/**Register a callback function for when a key is held down.*/
	registerOnKeyHold(key, callback) {
		if (!this.allKeyData.some((x) => x.key == key))
			this.allKeyData.push(new KeyData(key));

		let idx = this.allKeyData.findIndex((x) => x.key == key);

		if (this.allKeyData[idx].onKeyHold != null)
			console.warn(key, " already has a registered onKeyHold callback");

		this.allKeyData[idx].onKeyHold = callback;
	}

	/**Register a callback function for when a key is released.*/
	registerOnKeyRelease(key, callback) {
		if (!this.allKeyData.some((x) => x.key == key))
			this.allKeyData.push(new KeyData(key));

		let idx = this.allKeyData.findIndex((x) => x.key == key);

		if (this.allKeyData[idx].onKeyRelease != null)
			console.warn(
				key,
				" already has a registered onKeyRelease callback"
			);

		this.allKeyData[idx].onKeyRelease = callback;
	}

	/**Used only by index.ts*/
	onKeyDown(kbInfo) {
		let key = kbInfo.event.key;
		if (!this.allKeyData.some((x) => x.key == key))
			this.allKeyData.push(new KeyData(key));

		let idx = this.allKeyData.findIndex((x) => x.key == key);
		let inputData = this.allKeyData[idx];
		if (!inputData.isPressed && inputData.onKeyPress != null)
			inputData.onKeyPress();

		if (inputData.onKeyHold != null) inputData.onKeyHold();

		this.allKeyData[idx].isPressed = true;
	}

	/**Used only by index.ts*/
	onKeyUp(kbInfo) {
		let key = kbInfo.event.key;
		if (!this.allKeyData.some((x) => x.key == key))
			this.allKeyData.push(new KeyData(key));

		let idx = this.allKeyData.findIndex((x) => x.key == key);
		let inputData = this.allKeyData[idx];
		if (inputData.isPressed && inputData.onKeyRelease != null)
			inputData.onKeyRelease();

		this.allKeyData[idx].isPressed = false;
	}
}
