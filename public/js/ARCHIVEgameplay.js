const canvas = document.getElementById('canvas1');
const chatBoxEl = document.getElementById('chat-box');
const startMenuEl = document.getElementById('start-menu');
const playButtonEl = document.getElementById('play-button');
const ctx = canvas.getContext('2d');
canvas.width = 850;
canvas.height = 550;

let score = 0;
let gameFrame = 0;
ctx.font = '35px VT323';
ctx.fillStyle = 'white';

playButtonEl.addEventListener("click", e => {
  canvas.style.display = 'inline';
  chatBoxEl.style.display = 'block';
  startMenuEl.style.display = 'none';
  playButtonEl.style.display = 'none';
  // canvas = document.createElement('div');
  // canvas.setAttribute("id", "Div1");
  animate()
})

// mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
  x: canvas.width/2,
  y: canvas.height/2,
  click: false
}

canvas.addEventListener('mousedown', function(event) {
  mouse.click = true;
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;
});

canvas.addEventListener('mouseup', function(event) {
  mouse.click = false;
});

const playerLeft = new Image();
playerLeft.src = 'images/blob1b.png';
const playerRight = new Image();
playerRight.src = 'images/blob1.png';
var background = new Image();
background.src = "images/background1.png";

// players 
class Player {
  constructor() {
    this.x = canvas.width;
    this.y = canvas.height/2;
    this.radius = 50;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 300;
    this.spriteHeight = 300;
  };

  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    if (mouse.x != this.x) {
      // speed of player movement
      this.x -= dx/30;
    };
    if (mouse.y != this.y) {
      // speed of movement
      this.y -= dy/30;
    };
  };
  
  // line to mouse when clicked
  draw() {
    if (mouse.click) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    };
    // ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2);
    // ctx.fill();
    ctx.closePath();
    // ctx.fillRect(this.x, this.y, this.radius,10);
    
    if (this.x >= mouse.x){
      ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, 
      this.spriteWidth, this.spriteHeight, this.x - 50, this.y - 50, this.spriteWidth/3, this.spriteHeight/3);
    } else {
      ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, 
      this.spriteWidth, this.spriteHeight, this.x - 50, this.y - 50, this.spriteWidth/3, this.spriteHeight/3);
    }
    // If we change spriteWidth/spriteHeight we need to change this.x - 50 and this.y - 50, so the image would be centered
  };
};

// bubbles
const ball1 = new Image();
ball1.src = 'images/blob-ball1.png';

var bubblesArray = []
class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 4 + 1;
    this.counted = false;
    this.distance;
    // So each bubble would give just 1 point
    this.counted = false;
    // Adding a sound to bubbles(also randomizing them between 2)
    // this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    this.sound = 'sound1';
  };

  update() {
    this.y -= this.speed
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx*dx + dy*dy);
  };
  
  draw() {
    // ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2);
    // ctx.fill();
    ctx.closePath();
    // ctx.stroke();
    
    ctx.drawImage(ball1, this.x - this.radius, this.y - this.radius, this.radius * 1., this.radius * 1);
  };
};

// source for bubble sounds
const bubblePop1 = document.createElement('audio');
bubblePop1.src = 'images/hit.wav';

// run this code every frame
function handleBubbles() {
  if (gameFrame % 50 == 0) {
    bubblesArray.push(new Bubble());
  };

  for (let i = 0; i < bubblesArray.length; i++) {
    bubblesArray[i].update();
    bubblesArray[i].draw();
  };

  for (let i = 0; i < bubblesArray.length; i++) {
    if (bubblesArray[i].y < 0 - bubblesArray[i].radius *2) {
      bubblesArray.splice(i, 1);
    };

    if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
      if (!bubblesArray[i].counted){
        if (bubblesArray[i].sound == 'sound1'){
          const clonedSound = bubblePop1.cloneNode(true);
          clonedSound.volume = 0.2;
          clonedSound.play();
        }
        score++;
        bubblesArray[i].counted = true;
        // If we hit a bubble it's going to be removed
        bubblesArray.splice(i, 1);
      };
    };
  };
};

const player = new Player();

// animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background,0,0);   
  handleBubbles();
  player.update();
  player.draw();
  ctx.fillText('score: ' + score, 10, 50);
  ctx.fillstyle = 'black';
  gameFrame ++;
  requestAnimationFrame(animate);
}