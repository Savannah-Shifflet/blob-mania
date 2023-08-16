class Projectile {
  constructor({x, y, radius, color = 'white', velocity, image}) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.sound = new Audio();
    this.sound.src = '/sprites/hit.wav';
    this.image = new Image();
    this.image.src = image;
  }

  draw() {
    c.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 3.5, this.radius * 3.5);
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x * 2;
    this.y = this.y + this.velocity.y * 2;
  }

  playSound(volume = 1) {
    this.sound.volume = volume;
    this.sound.play();
  }
}
