class avatarCanvas {
	context = null;
	frame = 0;
	img;
	properties;
	interval;
	position = { x: 0, y: 0 };
	scale = 1;

	animName = "";
	animInterval = 0;
	animFrameTime = 0;

	update(deltaSecs) {
		this.animFrameTime += deltaSecs;
		while (this.animFrameTime > this.animInterval) {
			this.frame++;
			this.animFrameTime -= this.animInterval;
		}
	}

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

	async load(context, properties, spriteSheet) {
		this.context = context;

		await fetch(properties)
			.then((response) => response.json())
			.then((json) => (this.properties = json));

		this.img = new Image();
		this.img.src = spriteSheet;
		this.img.onload = this.playAnim("Idle");
	}

	playAnim(animName) {
		this.animName = animName;
		this.animInterval = 1.0 / this.properties.framesPerSec;
	}
}
