//Run with node

//Part pngs must be arranged in ./v1/arcadian-parts as:
//[Gender]/[BodyPart]/[PartName].png

const arcadianPartsPath = "./v1/arcadian-parts";
const partsConfigPath = "./src/partsConfig.json";
const fs = require('fs');

generatePartsConfig();

/**Run with node*/
function generatePartsConfig() {
	let output = getAvatarFiles();
	let json = JSON.stringify(output);
	fs.writeFile(partsConfigPath, json, function (error) {
		if (error) throw error;
		console.log("Saved at " + partsConfigPath);
	});
}

function getAvatarFiles() {
	// Sample Format of output
	let returnVal = [
		{
			Gender: "Female",
			Parts: [
				{
					Name: "Bottom",
					Files: [
						{
							Name: "Alien-Queen-Bottom",
							Path: "v1/arcadian-parts/Female/Bottom/Alien-Queen-Bottom.png"
						}
					]
				}
			]
		}
	];
	returnVal.length = 0;

	let allGenders = getSubdirectories(arcadianPartsPath);
	for (let genderName of allGenders) {
		let newGender = {
			Gender: genderName,
			Parts: []
		};

		let genderPath = arcadianPartsPath + "/" + genderName;
		newGender.Parts = getAllParts(genderPath);

		returnVal.push(newGender);
	}

	return returnVal;
}

function getAllParts(genderPath) {
	let returnVal = [];

	let allParts = getSubdirectories(genderPath);

	for (let partName of allParts) {
		let newPart = {
			Name: partName,
			Files: []
		};

		let partPath = genderPath + "/" + partName;
		newPart.Files = getAllFiles(partPath);

		returnVal.push(newPart);
	}

	return returnVal;
}

function getAllFiles(partPath) {
	let returnVal = [];

	let allFiles = getFileNames(partPath);
	for (let fileName of allFiles) {
		let newFile = {
			Name: fileName.slice(0, -4), // remove file extension
			Path: partPath + "/" + fileName
		};

		returnVal.push(newFile);
	}

	return returnVal;
}

function getSubdirectories(path) {
	return fs.readdirSync(path).filter(function (file) {
		return fs.statSync(path + "/" + file).isDirectory();
	});
}

function getFileNames(path) {
	return fs.readdirSync(path, { withFileTypes: true })
		.filter(item => !item.isDirectory())
		.map(item => item.name)
}
