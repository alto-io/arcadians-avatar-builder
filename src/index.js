window.onload = (event) => {
	initialize();
};

// global variables
var g_canvas = document.getElementById("renderCanvas");
var g_scene = null;
var g_engine = null;
var g_camera = null;
var g_isLoaded = false;
var g_partsIdx = 0;
var g_keyboardHandler = new KeyboardHandler();
var g_screenshotHandler = new ScreenshotHandler();
var g_partsLoader = new PartsLoader();
var g_animPrev = null;

/**
 * List of files per avatar part. Contents are generated at runtime, based on g_config.partsConfigPath
 * Initial value is sample format for reference.
 * */
var g_fileList = [
	{
		Gender: "Female",
		Parts: [
			{
				Name: "Bottom",
				Files: [
					{
						Name: "Alien-Queen-Bottom",
						Path: "v1/arcadian-parts/Female/Bottom/Alien-Queen-Bottom.png",
					},
				],
			},
		],
	},
];

/**
 * Main initialize function.
 */
function initialize() {
	waitForLoading();
}

async function waitForLoading() {
	g_fileList.length = 0;

	await fetch(g_config.partsConfigPath)
		.then((response) => response.json())
		.then((json) => (g_fileList = json));

	afterLoading();
}

function afterLoading() {
	g_engine = new BABYLON.Engine(g_canvas, true, {
		preserveDrawingBuffer: true, // for screenshots
		stencil: true,
	});

	g_scene = new BABYLON.Scene(g_engine);
	g_camera = new BABYLON.UniversalCamera(
		"Camera",
		new BABYLON.Vector3(0, 1, 10),
		g_scene
	);

	g_camera.setTarget(new BABYLON.Vector3(0, 1, 0));
	g_camera.fov = 0.5;

	var light1 = new BABYLON.HemisphericLight(
		"light1",
		new BABYLON.Vector3(1, 1, 0),
		g_scene
	);

	// for debugging
	//g_camera.attachControl(g_canvas, true);
	//g_scene.debugLayer.show();

	initEvents();
	initGender();

	g_engine.runRenderLoop(() => {
		g_scene.render();
	});

	loadAvatar("Male");
}

/**
 * Initialize event handling
 */
function initEvents() {
	g_scene.onKeyboardObservable.add((kbInfo) => {
		//console.log(kbInfo.event.key);

		switch (kbInfo.type) {
			case BABYLON.KeyboardEventTypes.KEYDOWN:
				g_keyboardHandler.onKeyDown(kbInfo);
				break;
			case BABYLON.KeyboardEventTypes.KEYUP:
				g_keyboardHandler.onKeyUp(kbInfo);
				break;
		}
	});

	/*
	g_keyboardHandler.registerOnKeyPress("Enter", () => {
		console.log("Enter was pressed!");
	});
	*/
}

/**
 * Add gender buttons to the html
 */
function initGender() {
	var element = document.getElementById("gender");
	if (element == null) return;

	element.innerHTML = "";

	for (var g of g_config.list) {
		var button = document.createElement("button");
		button.innerText = g.id;
		button.setAttribute("onClick", `loadAvatar('${g.id}')`);
		element.appendChild(button);
	}
}

/**
 * Plays the animation of an avatar
 * @param {string} animName - Name of the animation this is defined in config.js
 */
function playAnim(animName) {
	var info = g_partsLoader.currAvatar.animations.find(
		(x) => x.name == animName
	);
	if (info == null) return;

	var anim = g_scene.getAnimationGroupByName(info.id);
	if (anim == null) return;

	if (g_animPrev != null) g_animPrev.stop();

	anim.start(true);
	g_animPrev = anim;
}

/**
 * Cycles through each texture and replace a specific part
 * @param {string} key - The key for the material of the part to be replaced this is defined in the config.js
 */
function cycleParts(key) {
	if (!g_isLoaded) return;

	g_partsIdx++;
	var arr = g_partsLoader.list[key];
	if (arr == null) return;

	if (g_partsIdx >= arr.length) {
		g_partsIdx = 0;
	}

	var dir = arr[g_partsIdx];
	this.replaceParts(key, dir);
}

/**
 * Replaces the texture of a selected part material
 * @param {string} key - The key for the material of the part to be replaced this is defined in the config.js
 * @param {string} fileName - Name of the file with a file format suffix (FileName.png)
 */
function replaceParts(key, fileName) {
	g_partsLoader.replaceParts(key, fileName);
}

/**
 * Loads the avatar and the list of materials and the collection of parts, additionally sets the animation to 'Idle' by default
 * @param {string} id - ID of the avatar this is defined in config.js
 */
function loadAvatar(id) {
	g_partsLoader.loadAvatar(id, () => {
		g_isLoaded = true;

		// play idle by default
		playAnim("Idle");
	});
}

function createSpritesheet() {
	g_scene.onBeforeRenderObservable.runCoroutineAsync(
		g_screenshotHandler.startScreenshotsCr(
			g_canvas,
			g_engine,
			g_scene,
			g_camera
		)
	);
}
