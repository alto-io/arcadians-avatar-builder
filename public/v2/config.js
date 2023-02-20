g_config = {
	spritesheet: {
		/** Size of each individual sprite, selected by the user.*/
		sizes: [64, 72, 80, 100, 128, 256],

		/**
		 * How many frames to skip for the duration of the anim
		 * Increasing this number will result in fewer frames on the sprite sheet
		 * Decreasing this number will result in more frames on the sprite sheet
		 */
		framesToSkip: 3,

		/**
		 * Default frame rate of the animations to play.
		 * Used with framesToSkip to generate properties.json
		 */
		defaultFrameRate: 60,

		/**
		 * Which animations to use as reference for the spritesheet.
		 * Their order in the array determines their vertical order on the sheet
		 */
		targetAnimations: ["Idle", "Cheer", "Attack"],

		/** Export settings for the spritesheet */
		zipFileName: "YourArcadian.zip",
		spritesSubFolder: "",
		sheetfileName: "sheet.png",
		sheetJsonName: "properties.json",
	},

	list: [
		{
			id: "Male",
			gltfPath: "./v2/gltf/Male/",      /** folder to the gltf */
			gltfFileName: "arcadian.gltf",   /** filename of the gltf */
			position: { x: 0, y: -1, z: 0 }, /** Position on the scene */
			scaling: { x: 4, y: 4, z: -4 },  /** Scale of the avatar */
			materials: [
				/**
				 * id - material names defined in Blender
				 * name - friendly name to be shown on the html page.
				 *      - also the name of the parts folder
				 */
				{ id: "Skin", name: "Skin" },
				{ id: "Head", name: "Head" },
				{ id: "Top", name: "Top" },
				{ id: "Bottom", name: "Bottom" },
				{ id: "Left Hand", name: "Left Hand" },
				{ id: "Right Hand", name: "Right Hand" },
			],
			animations: [
				/**
				 * id - animation names defined in Blender
				 * name - friendly name to be shown on the html page
				 */
				{ id: "Idle", name: "Idle" },
				{ id: "Cheer", name: "Cheer" },
				{ id: "Attack", name: "Attack" },
			],
		},
		{
			id: "Female",
			gltfPath: "./v2/gltf/Female/",   /** folder to the gltf */
			gltfFileName: "arcadian.gltf",   /** filename of the gltf */
			position: { x: 0, y: -1, z: 0 }, /** Position on the scene */
			scaling: { x: 4, y: 4, z: -4 },  /** Scale of the avatar */
			materials: [
				/**
				 * id - material names defined in Blender
				 * name - friendly name to be shown on the html page.
				 *      - also the name of the parts folder
				 */
				{ id: "Skin", name: "Skin" },
				{ id: "Head", name: "Head" },
				{ id: "Top", name: "Top" },
				{ id: "Bottom", name: "Bottom" },
				{ id: "Left Hand", name: "Left Hand" },
				{ id: "Right Hand", name: "Right Hand" },
			],
			animations: [
				/**
				 * id - animation names defined in Blender
				 * name - friendly name to be shown on the html page
				 */
				{ id: "Idle", name: "Idle" },
				{ id: "Cheer", name: "Cheer" },
				{ id: "Attack", name: "Attack" },
			],
		},
	],

	partsConfigPath: "./v2/arcadian-parts/partsConfig.json",
};
