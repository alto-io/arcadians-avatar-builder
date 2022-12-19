class PartInfo {
	matName = "";
	path = "";
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
		});
	}

	replaceParts(key, fileName) {
		if (!key || !fileName) return;

		var info = this.infoList[key];
		if (info == null) return;
		if (!info.matName || !info.path) return;

		var mat = g_scene.getMaterialByName(info.matName);
		var tex = this.#loadedTextures.find((x) => x.name == fileName);
		if (tex != null) {
			mat.albedoTexture = tex;
		} else {
			tex = new BABYLON.Texture(
				info.path + fileName,
				g_scene,
				true,
				false,
                BABYLON.Texture.NEAREST_SAMPLINGMODE
			);
			tex.onLoadObservable.add(() => {
				tex.name = fileName;
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

	#getPartsInfo(isMale) {
		if (isMale) this.#getMaleParts();
		else this.#getFemaleParts();

		// Get parts collection
		for (var key in this.infoList) {
			var path = this.infoList[key].path;
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open("GET", this.infoList[key].path, false);

			var instance = this;
			xmlHttp.onload = () => {
				if (xmlHttp.status != 200) {
					console.trace("failed to load file list");
					return;
				}

				var fileList = xmlHttp.response.split("\n");
				var list = [];
				for (var i = 0; i < fileList.length; i++) {
					var line = fileList[i].toLowerCase();
					path = path.toLowerCase();

					if (line.includes(".png")) {
						var end = line.lastIndexOf(".png") + 4;
						var start = line.lastIndexOf(">", end) + 1;

						if (end < start || start < 0 || end < 0) continue;

						var file = line.substring(start, end);
						list.push(file);
					}
				}

				instance.list[key] = list;
			};

			xmlHttp.send(null);
		}
	}

	// PROTOTYPE: Use manual loading for now
	#getMaleParts() {
		var skin = new PartInfo();
		skin.matName = "mat.mskin";
		skin.path = "/arcadian-parts/Male/Skin/";

		var eyes = new PartInfo();
		eyes.matName = "mat.meyes";
		eyes.path = "/arcadian-parts/Male/Eyes/";

		var head = new PartInfo();
		head.matName = "mat.mhead";
		head.path = "/arcadian-parts/Male/Head/";

		var mouth = new PartInfo();
		mouth.matName = "mat.mmouth";
		mouth.path = "/arcadian-parts/Male/Mouth/";

		var top = new PartInfo();
		top.matName = "mat.mtop";
		top.path = "/arcadian-parts/Male/Top/";

		var leftHand = new PartInfo();
		leftHand.matName = "mat.mleft";
		leftHand.path = "/arcadian-parts/Male/Left%20Hand/";

		var rightHand = new PartInfo();
		rightHand.matName = "mat.mright";
		rightHand.path = "/arcadian-parts/Male/Right%20Hand/";

		var bot = new PartInfo();
		bot.matName = "mat.mbot";
		bot.path = "/arcadian-parts/Male/Bottom/";

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
		skin.path = "/arcadian-parts/Female/Skin/";

		var eyes = new PartInfo();
		eyes.matName = "mat.femeyes";
		eyes.path = "/arcadian-parts/Female/Eyes/";

		var head = new PartInfo();
		head.matName = "mat.femhead";
		head.path = "/arcadian-parts/Female/Head/";

		var mouth = new PartInfo();
		mouth.matName = "mat.femmouth";
		mouth.path = "/arcadian-parts/Female/Mouth/";

		var top = new PartInfo();
		top.matName = "mat.femtop";
		top.path = "/arcadian-parts/Female/Top/";

		var leftHand = new PartInfo();
		leftHand.matName = "mat.femleft";
		leftHand.path = "/arcadian-parts/Female/Left%20Hand/";

		var rightHand = new PartInfo();
		rightHand.matName = "mat.femright";
		rightHand.path = "/arcadian-parts/Female/Right%20Hand/";

		var bot = new PartInfo();
		bot.matName = "mat.fembottom";
		bot.path = "/arcadian-parts/Female/Bottom/";

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
