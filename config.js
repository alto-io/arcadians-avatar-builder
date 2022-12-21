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
		 * Their order in the array determins their vertical order on the sheet
		 */
		targetAnimations: ["Idle", "Walk", "Attack - Knight"],

		zipFileName: "YourArcadian.zip",
		spritesSubFolder: "sprites/",
		sheetfileName: "sheet.png",
	},

	list: [
		{
			id: "Male",
			gltfPath: "./gltf/Male/",
			gltfFileName: "ArcadianAvatar.gltf",
			position: { x: 0, y: -1, z: 0 },
			materials: [
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
			gltfPath: "./gltf/Female/",
			gltfFileName: "ArcadianAvatar - Female.gltf",
			position: { x: 0, y: -1, z: 0 },
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
};
