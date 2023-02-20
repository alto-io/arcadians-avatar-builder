import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import "@babylonjs/loaders/glTF";

class AvatarConfig {
    list = [];

    getById(id) {
        var info = this.list.find((x) => x.id == id);
        return info;
    }
}

class AvatarInfo {
    id = "";
    gltfPath = "";
    gltfFileName = "";
    materials = [];
    animations = [];
}

class PartInfo {
    id = "";
    name = "";
}

var g_scene;
var g_config;
var g_fileList;

export class PartsLoader {
    currAvatar = null;
    list = {};
    matList = [];

    #loadedTextures = [];

    initialize(scene, config, fileList) {
        g_scene = scene;
        g_config = config;
        g_fileList = fileList;
    }

    /**
     * Loads the avatar and the list of materials and the collection of parts
     * @param {string} id - ID of the avatar this is defined in config.js
     * @param {function} callback - Callback for when the gtlf is finished loading
     */
    loadAvatar(id, callback) {
        this.#reset();

        var config = new AvatarConfig();
        config.list = g_config.list;

        var avatarInfo = config.getById(id);
        if (avatarInfo == null) return;

        this.currAvatar = avatarInfo;

        BABYLON.SceneLoader.Append(avatarInfo.gltfPath, avatarInfo.gltfFileName, g_scene, () => {
            this.#onAppendSuccess(avatarInfo, id);
            callback(true);
        });
    }

    /**
     * Call this after loading the GLTF successfully
     */
    #onAppendSuccess(avatarInfo, id) {
        this.matList = avatarInfo.materials;
        this.#getPartsList(id);

        for (var n of g_scene.rootNodes) {
            if (n.name == "__root__") {
                (n.position = new BABYLON.Vector3(avatarInfo.position.x, avatarInfo.position.y, avatarInfo.position.z)),
                    (n.scaling = new BABYLON.Vector3(avatarInfo.scaling.x, avatarInfo.scaling.y, avatarInfo.scaling.z));
            }
        }

        for (var m of g_scene.materials) {
            if (m != null && m.albedoTexture != null) {
                m.albedoTexture.updateSamplingMode(BABYLON.Texture.NEAREST_SAMPLINGMODE);
            }
        }

        this.#addAnimationButtons(avatarInfo);
        this.#addPartsButtons(avatarInfo);
    }

    /**
     * Add animation buttons to the html
     */
    #addAnimationButtons(avatarInfo) {
        var element = document.getElementById("animations");
        if (element == null) return;

        element.innerHTML = "";

        for (var a of avatarInfo.animations) {
            var button = document.createElement("button");
            button.innerText = a.name;
            button.setAttribute("onClick", `playAnim('${a.name}')`);
            element.appendChild(button);
        }
    }

    /**
     * Add different parts buttons to the html
     */
    #addPartsButtons(avatarInfo) {
        var element = document.getElementById("parts");
        if (element == null) return;

        element.innerHTML = "";

        for (var m of avatarInfo.materials) {
            var button = document.createElement("button");
            button.innerText = m.name;
            button.setAttribute("onClick", `cycleParts('${m.name}')`);
            element.appendChild(button);
        }
    }

    /**
     * Replaces the texture of a selected part material
     * @param {string} key - The key for the material of the part to be replaced this is defined in the config.js
     * @param {string} fileName - Name of the file with a file format suffix (FileName.png)
     */
    replaceParts(key, fileName) {
        if (!key || !fileName) return;

        var info = this.matList.find((x) => x.name == key);
        if (info == null) return;

        var mat = g_scene.getMaterialByName(info.id);
        if (mat == null) return;

        var tex = this.#loadedTextures.find((x) => x.name == fileName);
        if (tex != null) {
            mat.albedoTexture = tex;
        } else {
            tex = new BABYLON.Texture(fileName, g_scene, true, false, BABYLON.Texture.NEAREST_SAMPLINGMODE);
            tex.onLoadObservable.add(() => {
                tex.name = fileName;
                tex.hasAlpha = true;
                this.#loadedTextures.push(tex);

                mat.albedoTexture = tex;
            });
        }
    }

    /**
     * Diposes skeletons, materials and animationGroups
     *
     * Resets cached parts collection and material list
     */
    #reset() {
        if (g_scene == null) return;

        this.currAvatar = null;
        this.list = {};
        this.matList = {};

        // dispose skeletons
        if (g_scene.skeletons != null) {
            for (var i = g_scene.skeletons.length - 1; i >= 0; i--) {
                g_scene.skeletons[i].dispose();
            }
        }

        // dispose materials
        if (g_scene.materials != null) {
            for (var i = g_scene.materials.length - 1; i >= 0; i--) {
                g_scene.materials[i].dispose();
            }
        }

        // dispose animationGroups
        if (g_scene.animationGroups != null) {
            for (var i = g_scene.animationGroups.length - 1; i >= 0; i--) {
                g_scene.animationGroups[i].dispose();
            }
        }
    }

    /**
     * Gets the list of textures for a specific part/material
     * @param {string} id - Avatar ID
     * @param {string} matName - Material name/key
     * @returns Array of string
     */
    #getFiles(id, matName) {
        let gender = g_fileList.find((x) => x.Gender == id);
        if (gender == null) return null;

        let part = gender.Parts.find((x) => x.Name == matName);
        if (part == null) return null;

        let allPaths = [];
        for (let fileConfig of part.Files) {
            allPaths.push(fileConfig.Path);
        }

        return allPaths;
    }

    /**
     * Gets the list of parts/materials
     * @param {string} id - Avatar ID
     */
    #getPartsList(id) {
        for (var i = 0; i < this.matList.length; i++) {
            let mat = this.matList[i];
            this.list[mat.name] = this.#getFiles(id, mat.name);
        }
    }
}
