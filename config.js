g_config = {
	"list": [
		{
			"id": "Male",
			"gltfPath": "./gltf/Male/",
			"gltfFileName": "ArcadianAvatar.gltf",
			"materials": [
				{ "id": "mat.mskin", "name": "Skin" },
				{ "id": "mat.meyes", "name": "Eyes" },
				{ "id": "mat.mhead", "name": "Head" },
				{ "id": "mat.mmouth", "name": "Mouth" },
				{ "id": "mat.mtop", "name": "Top" },
				{ "id": "mat.mleft", "name": "Left Hand" },
				{ "id": "mat.mright", "name": "Right Hand" },
				{ "id": "mat.mbot", "name": "Bottom" },
				{ "id": "mat.mshad", "name": "Shadow" }
			],
			"animations": [
                { "id": "m.idle", "name": "Idle"},
                { "id": "m.walk", "name": "Walk"},
                { "id": "m.atkKni", "name": "Attack"},
            ]
		},
		{
			"id": "Female",
			"gltfPath": "./gltf/Female/",
			"gltfFileName": "ArcadianAvatar - Female.gltf",
			"materials": [
				{ "id": "mat.femskin", "name": "Skin" },
				{ "id": "mat.femeyes", "name": "Eyes" },
				{ "id": "mat.femhead", "name": "Head" },
				{ "id": "mat.femmouth", "name": "Mouth" },
				{ "id": "mat.femtop", "name": "Top" },
				{ "id": "mat.femleft", "name": "Left Hand" },
				{ "id": "mat.femright", "name": "Right Hand" },
				{ "id": "mat.fembottom", "name": "Bottom" },
				{ "id": "mat.femshad", "name": "Shadow" }
			],
			"animations": [
                { "id": "f.idle", "name": "Idle"},
                { "id": "f.walk", "name": "Walk"},
                { "id": "f.atkKni", "name": "Attack"},
            ]
		}
	]
}