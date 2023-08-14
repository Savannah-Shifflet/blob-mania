class Player {
  constructor(x, y, radius, imageSrc) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.image = new Image();
    this.image.src = imageSrc;

    if (this.image.complete) {
      this.loaded = true;
    } else {
      this.image.onload = () => {
        this.loaded = true;
        this.draw();
      };
    }
    // Tracks if key a is pressed
    this.a = false;
    this.d = false;
  }

  updateAnimation() {
    const ctx = c;
  
    if (this.a) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(this.image, -this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
      ctx.restore();
    } else if (this.d) {
      ctx.save();
      ctx.scale(1, 1);
      ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
      ctx.restore();
    } else {
      ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    // c.fillStyle = this.color;
    // c.fill();

    this.updateAnimation();
  }
}