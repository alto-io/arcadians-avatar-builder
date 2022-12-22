var canvas = null;
var context = null;
var frame = 0;
var img;
var properties;
var interval;

async function init() {
	this.canvas = document.getElementById("canvas");
	this.context = this.canvas.getContext("2d");

	this.context.mozImageSmoothingEnabled = false;
	this.context.webkitImageSmoothingEnabled = false;
	this.context.msImageSmoothingEnabled = false;
	this.context.imageSmoothingEnabled = false;
}

function render(animName) {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

	var anim = this.properties.animations.find((x) => x.name == animName);
	if (anim == null) return;

	var spriteWidth = this.properties.spriteWidth;
	var spriteHeight = this.properties.spriteHeight;

	if (frame >= anim.totalFrames) this.frame = 0;

	this.context.drawImage(
		this.img,
		this.frame * spriteWidth,
		anim.rowIndex * spriteHeight,
		spriteWidth,
		spriteHeight,
		spriteWidth * 2,
		0,
		spriteWidth * 2,
		spriteHeight * 2
	);

	this.frame++;
}

async function loadAvatar(properties, spriteSheet) {
	await fetch(properties)
		.then((response) => response.json())
		.then((json) => (this.properties = json));

	this.img = new Image();
	this.img.src = spriteSheet;
	this.img.onload = playAnim("Idle");
}

function playAnim(animName) {
	// To prevent animation speed up
	if (this.interval != null) {
		clearInterval(this.interval);
	}

	let timeout = 1000 / this.properties.framesPerSec;
	this.interval = window.setInterval(render, timeout, animName);
}

window.onload = function () {
	init();
};
