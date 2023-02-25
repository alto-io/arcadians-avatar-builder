import { ScreenshotHandler } from "./screenshotHandler";
import { PartsLoader } from "./partsLoader";
import * as Config from "./config";
import * as BABYLON from "@babylonjs/core/Legacy/legacy";

// import * as jsora from "./jsora";

// global variables
var g_config = Config.g_config;
var g_canvas = null;
var g_scene = null;
var g_engine = null;
var g_camera = null;
var g_isLoaded = false;
var g_partsIdx = 0;
var g_screenshotHandler = new ScreenshotHandler();
var g_partsLoader = new PartsLoader();
var g_animPrev = null;

var g_jsoraProject = null;
var g_oraCanvas = null;

async function loadOraFile() {

    g_jsoraProject = window.jsora.JSOra();

    const loadedFile = await fetch(g_config.oraConfigPath).then(r => r.blob());

    await g_jsoraProject.load(loadedFile);
}

export async function loadLocalOraFile(fileblob) {
    try {
    await g_jsoraProject.load(fileblob);
    } catch (e) {
        alert("invalid .ora file");
        return false;
    }
    await initializeVariablesFromOra();

    await renderAvatar();

    return true;
}


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

var g_OraPartsList = { PartsList: {} };
var g_OraPartsCategoryArray = [];
var g_ArrayOfAllParts = [];
/**
 * Main initialize function.
 */
export function initialize(canvas, scene) {
    g_canvas = canvas;
    g_scene = scene;
    g_engine = scene.getEngine();

    g_camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(0, 1, 10), g_scene);

    g_camera.setTarget(new BABYLON.Vector3(0, 1, 0));
    g_camera.fov = 0.5;

    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), g_scene);

    waitForLoading();
}

async function initializeVariablesFromOra() {

    function recursivelyCreateNodes(partArray) {
        if (partArray.length <= 1) {
          return partArray[0];
        } else {
          var node = {};
          var nodeName = partArray.pop();
          node[nodeName] = recursivelyCreateNodes(partArray);
          return node;
        }
    }
    
    function addToPartsList(partString) {
        const objectToAdd = recursivelyCreateNodes(partString.split("/").reverse());
        const partStringArray = partString.split("/");
    
        const name = partStringArray[partStringArray.length - 1];
        const path = partString.split("PartsList/")[1];

        const partToAdd = {
          name,
          path
        };
    
        var partCategory = partString.slice(0, partString.lastIndexOf("/"));
    
        // check if object should be added to array
        var currentPartSet = _.get(g_OraPartsList, partCategory);
        if (currentPartSet == undefined) {
          currentPartSet = [partToAdd];
        } else {
          if (Array.isArray(currentPartSet)) {
            currentPartSet.push(partToAdd);
          } else {
            console.warn(`Incorrect partString: ${partString}, not an array`);
          }
        }
        
        _.set(objectToAdd, partCategory, currentPartSet);
    
        var newItem = partCategory.split("/").pop();
        g_OraPartsCategoryArray.indexOf(newItem) === -1 ? g_OraPartsCategoryArray.push(newItem) : 0;
        g_ArrayOfAllParts.push(path);
        g_OraPartsList = _.merge(g_OraPartsList, objectToAdd);
      }

    function recurseOverParts(obj, parent) {
        for (let child of obj.children) {
            if (child.children != undefined) {
            // unhide parent layers
            child.hidden = false;
            recurseOverParts(child, parent + "/" + child.name);
            } else {
            addToPartsList(parent + "/" + child.name);
            }
        }
    }

    g_OraPartsList = { PartsList: {} };
    g_OraPartsCategoryArray = [];
    g_ArrayOfAllParts = [];

    recurseOverParts(g_jsoraProject, "PartsList");  
    
    g_ArrayOfAllParts.reverse(); // to display in proper order in frontend
}

export async function initializeOra(canvas) {
    g_oraCanvas = canvas;
    
    await loadOraFile();

    await initializeVariablesFromOra();

    setTimeout(renderAvatar, 50);
}

export function getOraPartsCategories() {
    return g_OraPartsCategoryArray;
}

export function getArrayOfAllParts() {
    return g_ArrayOfAllParts;
}

export async function getItemImage(itemPath) {
    
    var imageData = await g_jsoraProject.get_by_path(itemPath).get_base64();

    return imageData;
}

export function displayPart(itemPath) {
    var partLayer = g_jsoraProject.get_by_path(itemPath);

    // hide same layer parts
    partLayer.parent && partLayer.parent.children.map((child) =>
        {
            if (child != partLayer) {
                child.hidden = true;   
            }
        }
    )

    // toggle visibility
    partLayer.hidden = !partLayer.hidden;
    renderAvatar();
}

// TODO: 
// Loading from jsora source does not currently work on production build due to 
// next compile + gpu.js issues. We hack a fix for this by loading jsora via Script in _app.js
//
//
// see: 
// https://github.com/gpujs/gpu.js/issues/776
// https://stackoverflow.com/questions/43017000/babel-ignores-es6-inside-react-dangerouslysetinnerhtml-script-tag
// 
export async function renderAvatar() {

    const rend = new jsora.Renderer(g_jsoraProject);
    var renderCanvas = await rend.make_merged_image();

    var sourceImageData = renderCanvas.toDataURL("image/png");
    var destCanvasContext = g_oraCanvas.getContext('2d');
    var destinationImage = new Image;
    destinationImage.onload = function () {
        var scaleFactor = Math.min(g_oraCanvas.width / destinationImage.width, 
        g_oraCanvas.height / destinationImage.height);
        var newWidth = destinationImage.width * scaleFactor;
        var newHeight = destinationImage.height * scaleFactor;
        var x = (g_oraCanvas.width / 2) - (newWidth / 2);
        var y = (g_oraCanvas.height / 2) - (newHeight / 2);

        destCanvasContext.clearRect(0, 0, g_oraCanvas.width, g_oraCanvas.height);
        destCanvasContext.drawImage(destinationImage, x, y, newWidth, newHeight);
        // destCanvasContext.drawImage(destinationImage, 0, 0);
    };
    destinationImage.src = sourceImageData;
}

async function waitForLoading() {
    g_fileList.length = 0;

    await fetch(g_config.partsConfigPath)
        .then((response) => response.json())
        .then((json) => (g_fileList = json));

    //	g_screenshotHandler.initialize(g_config);

    g_partsLoader.initialize(g_scene, g_config, g_fileList);

    afterLoading();
}

function afterLoading() {
    // for debugging
    //g_camera.attachControl(g_canvas, true);
    //g_scene.debugLayer.show();

    initEvents();
    initGender();
    loadAvatar("Male");
}

/**
 * Initialize event handling
 */
function initEvents() {}

/**
 * Add gender buttons to the html
 */
function initGender() {
    //	var element = document.getElementById("gender");
    //	if (element == null) return;
    //
    //	element.innerHTML = "";
    //
    //	for (var g of g_config.list) {
    //		var button = document.createElement("button");
    //		button.innerText = g.id;
    //		button.setAttribute("onClick", `loadAvatar('${g.id}')`);
    //		element.appendChild(button);
    //	}
}

/**
 * Plays the animation of an avatar
 * @param {string} animName - Name of the animation this is defined in config.js
 */
export function playAnim(animName) {
    var info = g_partsLoader.currAvatar.animations.find((x) => x.name == animName);
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
export function replaceParts(key, fileName) {
    g_partsLoader.replaceParts(key, fileName);
}

export async function updateBabylonParts(key, oraPath) {
    var base64Image = await g_jsoraProject.get_by_path(oraPath).get_base64(false);
    g_partsLoader.replaceParts(key, base64Image);
}

/**
 * Loads the avatar and the list of materials and the collection of parts, additionally sets the animation to 'Idle' by default
 * @param {string} id - ID of the avatar this is defined in config.js
 */
export function loadAvatar(id) {
    g_partsLoader.loadAvatar(id, () => {
        g_isLoaded = true;

        // play idle by default
        playAnim("Idle");
    });
}

function createSpritesheet() {
    g_scene.onBeforeRenderObservable.runCoroutineAsync(g_screenshotHandler.startScreenshotsCr(g_canvas, g_engine, g_scene, g_camera));
}
