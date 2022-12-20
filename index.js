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

function initialize() {
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

	//var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {}, g_scene);
	//var postProcess = new BABYLON.PassPostProcess("Scene copy", 1.0, g_camera, BABYLON.Texture.NEAREST_SAMPLINGMODE);

	// for debugging
	//g_camera.attachControl(g_canvas, true);
	//g_scene.debugLayer.show();

	initEvents();

	g_engine.runRenderLoop(() => {
		g_scene.render();
	});

	loadAvatar("Male");
}

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

function cycleParts(key) {
	if (!g_isLoaded) return;

	g_partsIdx++;
	var arr = g_partsLoader.list[key];
	if (arr == null) return;

	if (g_partsIdx >= arr.length) {
		g_partsIdx = 0;
	}

	var dir = arr[g_partsIdx];
	g_partsLoader.replaceParts(key, dir);
}

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
			g_engine,
			g_scene,
			g_camera,
			g_animPrev
		)
	);
}
