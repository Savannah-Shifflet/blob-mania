class Projectile {
constructor({x, y, radius, color = 'white', velocity}) {
    this.x = x,
    this.y = y,
    this.radius = radius,
    this.color = color,
    this.velocity = velocity,
    this.sound = new Audio();
    this.sound.src = '/sprites/hit.wav';
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }

  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }

  playSound(volume = 1) {
    this.sound.volume = volume;
    this.sound.play();
  }
}
