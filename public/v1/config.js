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
		targetAnimations: ["Idle", "Walk", "Attack - Knight"],

		/** Export settings for the spritesheet */
		zipFileName: "YourArcadian.zip",
		spritesSubFolder: "",
		sheetfileName: "sheet.png",
		sheetJsonName: "properties.json",
	},

	/** List of avatar gltf files. Right now there's one for male and female */
	list: [
		{
			id: "Male",
			gltfPath: "./v1/gltf/Male/",         /** folder to the gltf */
			gltfFileName: "ArcadianAvatar.gltf", /** filename of the gltf */
			position: { x: 0, y: -1, z: 0 },     /** Position on the scene */
			scaling: { x: 1, y: 1, z: -1 },      /** Scale of the avatar */
			materials: [
				/**
				 * id - material names defined in Blender
				 * name - friendly name to be shown on the html page.
				 *      - also the name of the parts folder
				 */
				{ id: "mat.mskin", name: "Skin" },
				{ id: "mat.meyes", name: "Eyes" },
				{ id: "mat.mhead", name: "Head" },
				{ id: "mat.mmouth", name: "Mouth" },
				{ id: "mat.mtop", name: "Top" },
				{ id: "mat.mleft", name: "Left Hand" },
				{ id: "mat.mright", name: "Right Hand" },
				{ id: "mat.mbot", name: "Bottom" },
				{ id: "mat.mshad", name: "Shadow" },
			],
			animations: [
				/**
				 * id - animation names defined in Blender
				 * name - friendly name to be shown on the html page
				 */
				{ id: "m.idle", name: "Idle" },
				{ id: "m.walk", name: "Walk" },
				{ id: "m.talk", name: "Talk" },
				{ id: "m.talkpositive", name: "Talk - Positive" },
				{ id: "m.talknegative", name: "Talk - Negative" },
				{ id: "m.hit", name: "Hit" },
				{ id: "m.stun", name: "Stun" },
				{ id: "m.death", name: "Death" },
				{ id: "m.win", name: "Win" },
				{ id: "m.lose", name: "Lose" },
				{ id: "m.skillBuff", name: "Skill - Buff" },
				{ id: "m.skillMelee", name: "Skill - Melee" },
				{ id: "m.skillRanged", name: "Skill - Ranged" },
				{ id: "m.atkAss", name: "Attack - Assassin" },
				{ id: "m.atkGun", name: "Attack - Gunner" },
				{ id: "m.atkKni", name: "Attack - Knight" },
				{ id: "m.atkTec", name: "Attack - Tech" },
				{ id: "m.atkWiz", name: "Attack - Wizard" },
			],
		},
		{
			id: "Female",
			gltfPath: "./v1/gltf/Female/",
			gltfFileName: "ArcadianAvatar - Female.gltf",
			position: { x: 0, y: -1, z: 0 },
			scaling: { x: 1, y: 1, z: -1 },
			materials: [
				{ id: "mat.femskin", name: "Skin" },
				{ id: "mat.femeyes", name: "Eyes" },
				{ id: "mat.femhead", name: "Head" },
				{ id: "mat.femmouth", name: "Mouth" },
				{ id: "mat.femtop", name: "Top" },
				{ id: "mat.femleft", name: "Left Hand" },
				{ id: "mat.femright", name: "Right Hand" },
				{ id: "mat.fembottom", name: "Bottom" },
				{ id: "mat.femshad", name: "Shadow" },
			],
			animations: [
				{ id: "f.idle", name: "Idle" },
				{ id: "f.walk", name: "Walk" },
				{ id: "f.talk", name: "Talk" },
				{ id: "f.talkpositive", name: "Talk - Positive" },
				{ id: "f.talknegative", name: "Talk - Negative" },
				{ id: "f.hit", name: "Hit" },
				{ id: "f.stun", name: "Stun" },
				{ id: "f.death", name: "Death" },
				{ id: "f.win", name: "Win" },
				{ id: "f.lose", name: "Lose" },
				{ id: "f.skillBuff", name: "Skill - Buff" },
				{ id: "f.skillMelee", name: "Skill - Melee" },
				{ id: "f.skillRanged", name: "Skill - Ranged" },
				{ id: "f.atkAss", name: "Attack - Assassin" },
				{ id: "f.atkGun", name: "Attack - Gunner" },
				{ id: "f.atkKni", name: "Attack - Knight" },
				{ id: "f.atkTec", name: "Attack - Tech" },
				{ id: "f.atkWiz", name: "Attack - Wizard" },
			],
		},
	],

	partsConfigPath: "./v1/arcadian-parts/partsConfig.json",
};
