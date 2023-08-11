// Canvas setup
const canvas = document.getElementById('canvas1');
// buil-in 2D method
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
// game Frame will be increased by 1 fr every animation loop
let gameFrame = 0;
// Setting up the score
ctx.font = '50px Georgia';


// Mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();

const mouse = {
  x: canvas.width/2,
  y: canvas.height/2,
  click: false
}
canvas.addEventListener('mousedown', function(e){
  mouse.click = true;
  mouse.x = e.x -  canvasPosition.left;
  mouse.y = e.y - canvasPosition.top;
  console.log(mouse.x, mouse.y);
});
canvas.addEventListener('mouseup', function(){
  mouse.click = false;
})

// Player
const playerLeft = new Image();
playerLeft.src = 'face1.png';
const playerRight = new Image();
playerRight.src = 'face2.png';

class Player {
  constructor(){
    this.x = canvas.width;
    this.y = canvas.height/2;
    this.radius = 50;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    // Check sizes later
    this.spriteWidth = 498;
    this.spritHeight = 327;
  }
  update(){
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    if (mouse.x != this.x) {
      // speed of the movement
      this.x -= dx/20;
    }
    if (mouse.y != this.y) {
      // speed of the movement
      this.y -= dy/20;
    }
  }
  // Small line
  draw(){
    if (mouse.click) {
        ctx.lineWidth = 0.2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
    }
    // circle - player character
    ctx.fillStyle = 'red';
    ctx.beginPath();
    // fully circle
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.fillRect(this.x, this.y, this.radius,10);

    ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth/4, this.spriteHeight/4);
  }
}
const player = new Player();

// Bubbles
const bubblesArray = [];
class Bubble {
  constructor(){
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    // So each bubble would give just 1 point
    this.counted = false;
    // Adding a sound to bubbles(also randomizing them between 2)
    // this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    this.sound = 'sound1';
  }
  update(){
    this.y -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx*dx + dy*dy);
  }
  draw(){
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke(); 
  }
}

// Function for bubble sounds
const bubblePop1 = document.createElement('audio');
bubblePop1.src = 'hit.wav';

// const bubblePop2 = document.createElement('audio');
// bubblePop2.src = 'TailWhip.flac';

// Run this code every 50frames
function handleBubbles(){
  if (gameFrame % 50 == 0){
    bubblesArray.push(new Bubble());
  }
  for (let i = 0; i < bubblesArray.length; i++){
    bubblesArray[i].update();
    bubblesArray[i].draw();
  }
  for (let i = 0; i < bubblesArray.length; i++){
    if(bubblesArray[i].y < 0 - bubblesArray[i].radius * 2){
      bubblesArray.splice(i, 1);
    }
    // distance between the player and a bubble
    if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius){
      if (!bubblesArray[i].counted){
        if (bubblesArray[i].sound == 'sound1'){
          bubblePop1.play();
          bubblePop1.volume = 0.2;
        }
        score++;
        bubblesArray[i].counted = true;
        // If we hit a bubble it's going to be removed
        bubblesArray.splice(i, 1);
      }
    }
  }
}
// Animation loop
function animate(){
  // clean canvas from old paint between every animation frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleBubbles();
  player.update();
  player.draw();
  ctx.fillStyle = 'black';
  ctx.fillText('score: ' + score, 10, 50);
  gameFrame++;
  requestAnimationFrame(animate);
}
animate();