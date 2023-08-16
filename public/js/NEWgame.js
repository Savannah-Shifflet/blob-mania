const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const socket = io();

const scoreEl = document.querySelector('#scoreEl');
const devicePixelRatio = 1;

// canvas.width = innerWidth * devicePixelRatio;
// canvas.height = innerHeight * devicePixelRatio;
canvas.width = 800;
canvas.height = 500;
console.log(window.devicePixelRatio);

c.scale(devicePixelRatio, devicePixelRatio);

const x = canvas.width / 2;
const y = canvas.height / 2;

const frontEndPlayers = {};
const frontEndProjectiles = {};

// Music
const music = new Audio('/sprites/gamemusic.mp3');
music.loop = true;
music.volume = 0.2;
music.addEventListener('canplay', () => {
  music.play();
});
const button = document.querySelector('#musicBtn');
const image = document.querySelector('#img-change');

button.addEventListener('click', function() {
  if (music.paused) {
    music.play();
    image.src = '/sprites/pausebtn.png';
  } else {
    music.pause();
    image.src = '/sprites/playbtn.png';
  }
});

music.play();


socket.on('connect', () => {
  socket.emit('initCanvas', { width: canvas.width, height: canvas.height, devicePixelRatio });
});

socket.on('updateProjectiles', (backEndProjectiles) => {
  for (const id in backEndProjectiles) {
    const backEndProjectile = backEndProjectiles[id];

    if (!frontEndProjectiles[id]) {
      frontEndProjectiles[id] = new Projectile({
        x: backEndProjectile.x,
        y: backEndProjectile.y,
        radius: 5,
        color: frontEndPlayers[backEndProjectile.playerId]?.color,
        velocity: backEndProjectile.velocity,
      });
      frontEndProjectiles[id].playSound(0.2);
    } else {
      frontEndProjectiles[id].x += backEndProjectiles[id].velocity.x;
      frontEndProjectiles[id].y += backEndProjectiles[id].velocity.y;
    };
  };
  for (const frontEndProjectileId in frontEndProjectiles) {
    if (!backEndProjectiles[frontEndProjectileId]) {
      delete frontEndProjectiles[frontEndProjectileId]
    }
  }
})

const playerImageSrc = ['sprites/blob1.png', 'sprites/blob2.png', 'sprites/blob3.png', 'sprites/blob4.png', 'sprites/blob1a.png', 'sprites/blob2a.png', 'sprites/blob3a.png', 'sprites/blob4a.png'];

let imageIterator = 0;
// When user joins a game we loop through all backEndPlayers and if player doesn't exist
socket.on('updatePlayers', (backEndPlayers) => {
  if (!backEndPlayers) {
    imageIterator = 0;
  };

  for (const id in backEndPlayers) {
    const backendPlayer = backEndPlayers[id];

    if (!frontEndPlayers[id]) {
      // Randomizing a sprite color for each player
      // const playerImageSrc = ['sprites/blob1.png', 'sprites/blob2.png', 'sprites/blob3.png', 'sprites/blob4.png'];
      const selectedImage = playerImageSrc[imageIterator];
      imageIterator++;
      frontEndPlayers[id] = new Player(backendPlayer.x, backendPlayer.y, 40, selectedImage, 5);
      // Adding a player in playerscore
      document.querySelector('#playerScore').innerHTML += `<div data-id='${id}'>Enemy: ${backendPlayer.score}</div>`
    } else {
      
      if (id === socket.id) {
        frontEndPlayers[id].x = backendPlayer.x
        frontEndPlayers[id].y = backendPlayer.y
        document.querySelector(`div[data-id="${id}"]`).innerHTML = `You: ${backendPlayer.score}`
        const lastBackEndInputIndex = playerInputs.findIndex(input => {
          return backendPlayer.sequenceNumber === input.sequenceNumber
        });

        if (lastBackEndInputIndex > -1)
          playerInputs.splice(0, lastBackEndInputIndex + 1)

        playerInputs.forEach(input => {
          frontEndPlayers[id].x += input.dx
          frontEndPlayers[id].y += input.dy
        });
      } else {
        // for all other frontEndPlayers
        // interpolation for lag so player does not teleport due to lag
        gsap.to(frontEndPlayers[id], {
          x: backendPlayer.x,
          y: backendPlayer.y,
          duration: 0.015,
          ease: 'linear'
        });
      };
    };
  };
  // Deleting a player from frontend
  for (const id in frontEndPlayers) {
    if (!backEndPlayers[id]) {

      const deleteDiv = document.querySelector(`div[data-id="${id}"]`)
      deleteDiv.parentNode.removeChild(deleteDiv)
      delete frontEndPlayers[id]
    };
  };
});

let animationId;

socket.on('gameOver', async (backEndPlayers) => {
  let playerArray = Object.keys(backEndPlayers)
  let id = playerArray[0];
  console.log(backEndPlayers)
  console.log(backEndPlayers[id].score)
  if(id === socket.id) {
      const win = document.createElement('div')
      win.textContent = 'YOU WIN!';
      win.setAttribute('id', "neon-text")
      win.setAttribute('style', "position: absolute; top: 40%; left: 33%; padding:4rem; background-image: radial-gradient(#2f0169 0%, #14062f 65%, #070a1a 80%); border-radius: 2rem");
      document.getElementById('gameOver').appendChild(win);
      let score = backEndPlayers[id].score ;
      const response = await fetch('/api/highscore', {
        method: 'POST',
        body: JSON.stringify({score}),
        headers: { 'Content-Type': 'application/json'}
      });
      if(response.ok){
        return;
      }     
      
    }else {
      const lose = document.createElement('div')
      lose.textContent = 'YOU LOSE!';
      lose.setAttribute('id', "neon-text");
      lose.setAttribute('style', "position: absolute; top: 40%; left: 33%; padding:4rem; background-image: radial-gradient(#2f0169 0%, #14062f 65%, #070a1a 80%); border-radius: 2rem");

      document.getElementById('gameOver').appendChild(lose);
    }
});

// let score = 0
function animate() {
  animationId = requestAnimationFrame(animate)
  //   c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.clearRect(0, 0, canvas.width, canvas.height)
  // Loop through frontEndPlayers object
  for (const id in frontEndPlayers) {
    const frontEndPlayer = frontEndPlayers[id]
    if (socket.id === id) {
      frontEndPlayer.draw('You');
    } else {
      frontEndPlayer.draw('Enemy');
    }
  };

  for (const id in frontEndProjectiles) {
    const frontEndProjectile = frontEndProjectiles[id]
    frontEndProjectile.draw()
  };

  // Flipping a sprite
  for (const id in frontEndPlayers) {
    const player = frontEndPlayers[id];
    player.draw('');
  };
};

animate();

const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
};

const playerSpeed = 3;
let sequenceNumber = [];
const playerInputs = [];

setInterval(() => {
  if (keys.w.pressed) {
    sequenceNumber++
    playerInputs.push({ sequenceNumber, dx: 0, dy: -playerSpeed })
    frontEndPlayers[socket.id].y -= playerSpeed
    socket.emit('keydown', { keycode: 'KeyW', sequenceNumber })
  };

  if (keys.a.pressed) {
    sequenceNumber++
    playerInputs.push({ sequenceNumber, dx: -playerSpeed, dy: 0 })
    frontEndPlayers[socket.id].x -= playerSpeed
    socket.emit('keydown', { keycode: 'KeyA', sequenceNumber })
  };

  if (keys.s.pressed) {
    sequenceNumber++
    playerInputs.push({ sequenceNumber, dx: 0, dy: playerSpeed })
    frontEndPlayers[socket.id].y += playerSpeed
    socket.emit('keydown', { keycode: 'KeyS', sequenceNumber })
  };

  if (keys.d.pressed) {
    sequenceNumber++
    playerInputs.push({ sequenceNumber, dx: playerSpeed, dy: 0 })
    frontEndPlayers[socket.id].x += playerSpeed
    socket.emit('keydown', { keycode: 'KeyD', sequenceNumber })
  };
}, 15);

window.addEventListener("keydown", (event) => {
  if (!frontEndPlayers[socket.id]) return

  switch (event.code) {
    case 'KeyW':
      keys.w.pressed = true;
    //   frontEndPlayers[socket.id].image.src = playerImageSrc[4];
      break

    case 'KeyA':
      keys.a.pressed = true;
      frontEndPlayers[socket.id].a = true;
      break;

    case 'KeyS':
      keys.s.pressed = true;
    //   frontEndPlayers[socket.id].image.src = playerImageSrc[4];
      break

    case 'KeyD':
      keys.d.pressed = true;
      frontEndPlayers[socket.id].d = true;
      break;
  };
});

window.addEventListener('keyup', (event) => {
  if (!frontEndPlayers[socket.id]) return;

  switch (event.code) {
    case 'KeyW':
      keys.w.pressed = false;
    //   frontEndPlayers[socket.id].image.src = playerImageSrc[0];
      break;

    case 'KeyA':
      keys.a.pressed = false;
      frontEndPlayers[socket.id].a = true;
      frontEndPlayers[socket.id].d = false;
      break;

    case 'KeyS':
      keys.s.pressed = false;
    //   frontEndPlayers[socket.id].image.src = playerImageSrc[0];
      break;

    case 'KeyD':
      keys.d.pressed = false;
      frontEndPlayers[socket.id].a = false;
      frontEndPlayers[socket.id].d = true;
      break;
  }
});