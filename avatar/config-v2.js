g_config = {
	spritesheet: {
		/**Size of each individual sprite*/
		spriteWidth: 128,
		/**Size of each individual sprite*/
		spriteHeight: 128,

		/**How many frames to skip for the duration of the anim*/
		framesToSkip: 3,

		/**
		 * Which animations to use as reference for the spritesheet.
		 * Their order in the array determines their vertical order on the sheet
		 */
		targetAnimations: ["Idle", "Cheer", "Attack"],

		zipFileName: "YourArcadian.zip",
		spritesSubFolder: "",
		sheetfileName: "sheet.png",
		sheetJsonName: "properties.json",
	},

	list: [
		{
			id: "Male",
			gltfPath: "./v2/gltf/",
			gltfFileName: "arcadian.gltf",
			position: { x: 0, y: -1, z: 0 },
			scaling: { x: 4, y: 4, z: -4 },
			materials: [
				{ id: "Skin", name: "Skin" },
				{ id: "Head", name: "Head" },
				{ id: "Top", name: "Top" },
				{ id: "Bottom", name: "Bottom" },
				{ id: "Left Hand", name: "Left Hand" },
				{ id: "Right Hand", name: "Right Hand" },
			],
			animations: [
				{ id: "Idle", name: "Idle" },
				{ id: "Cheer", name: "Cheer" },
				{ id: "Attack", name: "Attack" },
			],
		},
	],

	partsConfigPath: "./v2/arcadian-parts/partsConfig.json",
};
