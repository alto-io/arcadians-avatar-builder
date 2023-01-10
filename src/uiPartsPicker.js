window.onload = function () {
	initialize();

	var ui = new UIPartsPicker();
	ui.init();
};

function showPartsList(id, matName) {
	if (g_config == null) return;

	var div = document.getElementById("list-pick");
	if (div == null) return;

	div.innerHTML = "";

	var files = [];
	for (var i of g_fileList.List) {
		if (i.Gender == id && i.Part == matName) {
			files = i.Files;
		}
	}

	var header = document.createElement("H2");
	var text = document.createTextNode(matName);
	header.appendChild(text);
	div.append(header);

	for (var i of files) {
		console.log("Create " + i);
		var button = document.createElement("button");
		button.innerText = i;
		button.innerHTML = `<img src='${i}' />`;
		button.setAttribute("onClick", `replaceParts('${matName}', '${i}')`);
		div.appendChild(button);
	}
}

class UIPartsPicker {
	init() {
		if (g_config == null) return;
		if (g_config.list <= 0) return;

		var id = "Male";

		var avatar = g_config.list.find((x) => x.id == id);
		if (avatar == null) return;

		var div = document.getElementById("parts-pick");
		if (div == null) return;

		div.innerHTML = "";

		for (var m of avatar.materials) {
			var button = document.createElement("button");
			button.innerText = m.name;
			button.setAttribute(
				"onClick",
				`showPartsList('${id}', '${m.name}')`
			);
			div.appendChild(button);
		}
	}
}
