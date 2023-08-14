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
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    // Should work eventually?
    if (this.loaded) { // Check if the image is loaded before drawing
      c.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
  }
}
