window.onload = function () {
    initUI();
};

async function initUI() {
    await waitForLoading();

    initParts("Male");
}

function showPartsList(id, matName) {
    if (g_config == null) return;

    var div = document.getElementById("list-pick");
    if (div == null) return;

    div.innerHTML = "";

    var files = [];
    var avatar = g_fileList.find((x) => x.Gender == id);
    if (avatar == null) return;
    for (var i of avatar.Parts) {
        if (i.Name == matName) {
            files = i.Files;
        }
    }

    var header = document.createElement("H2");
    var text = document.createTextNode(matName);
    header.appendChild(text);
    div.appendChild(header);

    for (var i of files) {
        var group = document.createElement("div");
        group.id = "button-group";

        var text = document.createElement("p");
        text.innerText = i.Name;

        var button = document.createElement("button");
        button.innerText = i.Name;
        button.innerHTML = `<button class="img-size"><img src='${i.Path}' /></button>`;
        button.setAttribute("onClick", `replaceParts('${matName}', '${i.Path}')`);

        // Add button to group
        group.appendChild(button);

        // Add text to group;
        group.appendChild(text);

        // Add group to grid div
        div.appendChild(group);
    }
}

export function changeGender(id) {
    loadAvatar(id);
    initParts(id);
}

function initParts(id) {
    if (g_config == null) return;
    if (g_config.list <= 0) return;

    var avatar = g_config.list.find((x) => x.id == id);
    if (avatar == null) return;

    // Load Gender buttons
    var genderDiv = document.getElementById("gender-pick");
    if (genderDiv == null) return;

    genderDiv.innerHTML = "";
    for (var g of g_config.list) {
        var button = document.createElement("button");
        button.innerHTML = g.id;
        button.setAttribute("onClick", `changeGender('${g.id}')`);
        genderDiv.appendChild(button);
    }

    // Load Parts buttons
    var partsDiv = document.getElementById("parts-pick");
    if (partsDiv == null) return;

    partsDiv.innerHTML = "";
    for (var m of avatar.materials) {
        var button = document.createElement("button");
        button.innerText = m.name;
        button.setAttribute("onClick", `showPartsList('${id}', '${m.name}')`);
        partsDiv.appendChild(button);
    }

    // Default to the first material
    showPartsList(id, avatar.materials[0].name);
}
