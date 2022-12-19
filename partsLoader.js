class PartInfo {
	matName = "";
}

class PartsLoader {
	list = {};
	infoList = {};

	#loadedTextures = [];

	loadParts(path, fileName, isMale, completedCallback) {
		this.#reset();

		BABYLON.SceneLoader.Append(path, fileName, g_scene, () => {
			this.list = {};
			this.infoList = {};
			this.#getPartsInfo(isMale);
			completedCallback(true);

            for (var n of g_scene.rootNodes) {
                if (n.name == "__root__") {
                    n.position = new BABYLON.Vector3(0,-1,0);
                }
            }
		});
	}

	replaceParts(key, fileName) {
		if (!key || !fileName) return;

		var info = this.infoList[key];
		if (info == null) return;
		if (!info.matName) return;

		var mat = g_scene.getMaterialByName(info.matName);
		var tex = this.#loadedTextures.find((x) => x.name == fileName);
		if (tex != null) {
			mat.albedoTexture = tex;
		} else {
			tex = new BABYLON.Texture(
				"arcadian-parts/" + fileName,
				g_scene,
				true,
				false,
                BABYLON.Texture.NEAREST_SAMPLINGMODE
			);
			tex.onLoadObservable.add(() => {
				tex.name = fileName;
                tex.hasAlpha = true;
				this.#loadedTextures.push(tex);

				mat.albedoTexture = tex;
			});
		}
	}

	#reset() {
		if (g_scene == null) return;

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

	#getPartsInfo(isMale) {
		if (isMale) this.#getMaleParts();
		else this.#getFemaleParts();

        var gender = isMale ? "Male" : "Female";

		// Get parts collection
		for (var key in this.infoList) {
            this.list[key] = this.#getFiles(gender, key);
		}
	}

	// PROTOTYPE: Use manual loading for now
	#getMaleParts() {
		var skin = new PartInfo();
		skin.matName = "mat.mskin";

		var eyes = new PartInfo();
		eyes.matName = "mat.meyes";

		var head = new PartInfo();
		head.matName = "mat.mhead";

		var mouth = new PartInfo();
		mouth.matName = "mat.mmouth";

		var top = new PartInfo();
		top.matName = "mat.mtop";

		var leftHand = new PartInfo();
		leftHand.matName = "mat.mleft";

		var rightHand = new PartInfo();
		rightHand.matName = "mat.mright";

		var bot = new PartInfo();
		bot.matName = "mat.mbot";

		this.infoList["Skin"] = skin;
		this.infoList["Eyes"] = eyes;
		this.infoList["Head"] = head;
		this.infoList["Mouth"] = mouth;
		this.infoList["Top"] = top;
		this.infoList["Left Hand"] = leftHand;
		this.infoList["Right Hand"] = rightHand;
		this.infoList["Bottom"] = bot;
	}

	// PROTOTYPE: Use manual loading for now
	#getFemaleParts() {
		var skin = new PartInfo();
		skin.matName = "mat.femskin";

		var eyes = new PartInfo();
		eyes.matName = "mat.femeyes";

		var head = new PartInfo();
		head.matName = "mat.femhead";

		var mouth = new PartInfo();
		mouth.matName = "mat.femmouth";

		var top = new PartInfo();
		top.matName = "mat.femtop";

		var leftHand = new PartInfo();
		leftHand.matName = "mat.femleft";

		var rightHand = new PartInfo();
		rightHand.matName = "mat.femright";

		var bot = new PartInfo();
		bot.matName = "mat.fembottom";

		this.infoList["Skin"] = skin;
		this.infoList["Eyes"] = eyes;
		this.infoList["Head"] = head;
		this.infoList["Mouth"] = mouth;
		this.infoList["Top"] = top;
		this.infoList["Left Hand"] = leftHand;
		this.infoList["Right Hand"] = rightHand;
		this.infoList["Bottom"] = bot;
	}
}
