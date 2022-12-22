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
		targetAnimations: ["Idle", "Walk", "Attack"],

		zipFileName: "YourArcadian.zip",
		spritesSubFolder: "sprites/",
		sheetfileName: "sheet.png",
		sheetJsonName: "properties.json",
	},

	list: [
		{
			id: "Male",
			gltfPath: "./v2/male/gltf/",
			gltfFileName: "arcadian.gltf",
			position: { x: 0, y: -1, z: 0 },
			scaling: { x: 4, y: 4, z: -4 },
			materials: [
				{ id: "Skin", name: "Skin" },
				{ id: "Head", name: "Head" },
				{ id: "Top", name: "Top" },
				{ id: "Bottom", name: "Bottom" },
				{ id: "Left", name: "Left" },
				{ id: "Right", name: "Right" },
			],
			animations: [
				{ id: "Idle", name: "Idle" },
				{ id: "Cheer", name: "Walk" },
				{ id: "Attack", name: "Talk" },
			],
		}
	]
};

g_fileList = {
	List: [
		{
			Gender: "Male",
			Part: "Bottom",
			Files: [
				"v2/male/parts/bottom/bottom0.png",
				"v2/male/parts/bottom/bottom1.png",
			],
		},
		{
			Gender: "Male",
			Part: "Head",
			Files: [
				"v2/male/parts/head/head0.png",
				"v2/male/parts/head/head1.png",
			],
		},
		{
			Gender: "Male",
			Part: "Left",
			Files: [
				"v2/male/parts/left/left0.png",
				"v2/male/parts/left/left1.png",
				"v2/male/parts/left/left2.png",
			],
		},
		{
			Gender: "Male",
			Part: "Right",
			Files: [
				"v2/male/parts/right/right0.png",
				"v2/male/parts/right/right1.png",
				"v2/male/parts/right/right2.png",
			],
		},
		{
			Gender: "Male",
			Part: "Skin",
			Files: [
				"v2/male/parts/skin/skin0.png",
				"v2/male/parts/skin/skin1.png",
				"v2/male/parts/skin/skin2.png",
			],
		},
		{
			Gender: "Male",
			Part: "Top",
			Files: [
				"v2/male/parts/top/top0.png",
				"v2/male/parts/top/top1.png",
			],
		},
	],
};
