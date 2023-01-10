window.onload = function () {
	initialize();

	var ui = new UIPartsPicker();
	ui.init();
};

class UIPartsPicker {
	init() {
		if (g_config.list <= 0) return;

		var avatar = g_config.list[0];
		for (var mat of avatar.materials) {
			this.#addCategory(avatar.id, mat.name);
		}
	}

	#addCategory(id, matName) {
		var div = document.getElementById("category");
		var files = this.#getFiles(id, matName);

		var header = document.createElement("H2");
		var text = document.createTextNode(matName);
		header.appendChild(text);
		div.append(header);

		for (var i of files) {
			var button = document.createElement("button");
			button.innerText = i;
			button.innerHTML = `<img src='${i}' />`;
			button.setAttribute(
				"onClick",
				`replaceParts('${matName}', '${i}')`
			);
			div.appendChild(button);
		}
	}

	#getFiles(id, matName) {
		for (var i of g_fileList.List) {
			if (i.Gender == id && i.Part == matName) {
				return i.Files;
			}
		}
	}
}
