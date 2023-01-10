/**
 * Game Lego for loading the avatar spritesheet using Canvas
 */
class avatarCanvas {
	// Reference to the context
	context = null;

	// Current frame id of the current animation
	frame = 0;

	// Reference to the spritesheet image
	img;

	// Reference to the properties data that came with the spritesheet
	properties;

	// Not used?
	interval;

	// Position on the canvas
	position = { x: 0, y: 0 };

	// Scale of the avatar
	scale = 1;

	// Current animation name
	animName = "";

	// Number of seconds between animation frames
	animInterval = 0;

	// Elapsed animation frame time
	animFrameTime = 0;

	// Call this every frame and pass the seconds elapsed between frames
	update(deltaSecs) {
		// Update the animation
		this.animFrameTime += deltaSecs;
		while (this.animFrameTime > this.animInterval) {
			this.frame++;
			this.animFrameTime -= this.animInterval;
		}
	}

	// Draw the avatar using the Canvas API
	draw() {
		if (this.context == null) return;

		var anim = this.properties.animations.find(
			(x) => x.name == this.animName
		);
		if (anim == null) return;

		var spriteWidth = this.properties.spriteWidth;
		var spriteHeight = this.properties.spriteHeight;

		if (this.frame >= anim.totalFrames) this.frame = 0;

		this.context.drawImage(
			this.img,
			this.frame * spriteWidth,
			anim.rowIndex * spriteHeight,
			spriteWidth,
			spriteHeight,
			this.position.x,
			this.position.y,
			spriteWidth * this.scale,
			spriteHeight * this.scale
		);
	}

	// Load the spritesheet data
	async load(context, properties, spriteSheet) {
		this.context = context;

		await fetch(properties)
			.then((response) => response.json())
			.then((json) => (this.properties = json));

		this.img = new Image();
		this.img.src = spriteSheet;
		this.img.onload = this.playAnim("Idle");
	}

	// Change the animation to be played
	playAnim(animName) {
		this.animName = animName;
		this.animInterval = 1.0 / this.properties.framesPerSec;
	}
}
