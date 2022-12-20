class AvatarConfig {
	list = [];

	getById (id) {
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

class PartsLoader {
	currAvatar = null;
	list = {};
	matList = [];

	#loadedTextures = [];

	loadAvatar(id, callback) {
		this.#reset();
		
		var config = new AvatarConfig();
		config.list = g_config.list;

		var avatarInfo = config.getById(id);
		if(avatarInfo == null) return;

		this.currAvatar = avatarInfo;

		BABYLON.SceneLoader.Append(avatarInfo.gltfPath, avatarInfo.gltfFileName, g_scene, () => {
			this.matList = avatarInfo.materials;
			this.#getPartsList(id);

			for (var n of g_scene.rootNodes) {
                if (n.name == "__root__") {
                    n.position = new BABYLON.Vector3(0,-1,0);
                }
            }

			callback(true);
		});
	}

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
			g_isLoaded = false;
			tex = new BABYLON.Texture(
				"arcadian-parts/" + fileName,
				g_scene,
				true,
				false,
                BABYLON.Texture.NEAREST_SAMPLINGMODE
			);
			tex.onLoadObservable.add(() => {
				g_isLoaded = true;

				tex.name = fileName;
                tex.hasAlpha = true;
				this.#loadedTextures.push(tex);

				mat.albedoTexture = tex;
			});
		}
	}

	#reset() {
		if (g_scene == null) return;

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

    #getFiles(gender, part) {
        for (var i of g_fileList.List) {
            if (i.Gender == gender && i.Part == part) {
                return i.Files;
            }
        }
    }

	#getPartsList(id) {
		for (var i = 0; i < this.matList.length; i++) {
			let mat = this.matList[i];
			this.list[mat.name] = this.#getFiles(id, mat.name);
		}
	}
}