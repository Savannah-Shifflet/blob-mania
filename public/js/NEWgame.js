const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const socket = io()

const scoreEl = document.querySelector('#scoreEl')

const devicePixelRatio = window.devicePixelRatio || 1

canvas.width = innerWidth * devicePixelRatio;
canvas.height = innerHeight * devicePixelRatio;

const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 10, 'white');

const frontEndPlayers = {}
const frontEndProjectiles = {}

socket.on('connect', () => {
  socket.emit('initCanvas', { width: canvas.width, height: canvas.height })
})

socket.on('updateProjectiles', (backEndProjectiles) => {
  for (const id in backEndProjectiles) {
    const backEndProjectile = backEndProjectiles[id]

    if (!frontEndProjectiles[id]) {
      frontEndProjectiles[id] = new Projectile({
        x: backEndProjectile.x,
        y: backEndProjectile.y,
        radius: 5,
        color: frontEndPlayers[backEndProjectile.playerId]?.color,
        velocity: backEndProjectile.velocity
      })
    } else {
      frontEndProjectiles[id].x += backEndProjectiles[id].velocity.x
      frontEndProjectiles[id].y += backEndProjectiles[id].velocity.y
    }
  }
  for (const frontEndProjectileId in frontEndProjectiles) {
    if (!backEndProjectiles[frontEndProjectileId]) {
      delete frontEndProjectiles[frontEndProjectileId]
    }
  }
})

// When user joins a game we loop through all backEndPlayers and if player doesn't exist

socket.on('updatePlayers', (backEndPlayers) => {
  for (const id in backEndPlayers) {
    const backendPlayer = backEndPlayers[id]

    if (!frontEndPlayers[id]) {
      frontEndPlayers[id] = new Player(backendPlayer.x, backendPlayer.y, 10, 'white')
    } else {
      if (id === socket.id) {
        // if a player already exists
        frontEndPlayers[id].x = backendPlayer.x
        frontEndPlayers[id].y = backendPlayer.y

        const lastBackEndInputIndex = playerInputs.findIndex(input => {
          return backendPlayer.sequenceNumber === input.sequenceNumber
        })

        if (lastBackEndInputIndex > -1)
          playerInputs.splice(0, lastBackEndInputIndex + 1)

        playerInputs.forEach(input => {
          frontEndPlayers[id].x += input.dx
          frontEndPlayers[id].y += input.dy
        })
      } else {
        // for all other frontEndPlayers
        // interpolation for lag so player does not teleport due to lag
        gsap.to(frontEndPlayers[id], {
          x: backendPlayer.x,
          y: backendPlayer.y,
          duration: 0.015,
          ease: 'linear'
        })
      }
    }
  }
  // Deleting a player from frontend
  for (const id in frontEndPlayers) {
    if (!backEndPlayers[id]) {
      delete frontEndPlayers[id]
    }
  }
})

let animationId
// let score = 0
function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  // Loop through frontEndPlayers object
  for (const id in frontEndPlayers) {
    const frontEndPlayer = frontEndPlayers[id]
    frontEndPlayer.draw()
  }

  for (const id in frontEndProjectiles) {
    const frontEndProjectile = frontEndProjectiles[id]
    frontEndProjectile.draw()
  }

  // for (let i = frontEndProjectiles.length - 1; i >= 0; i--) {
  // const projectile = frontEndProjectiles[i];
  // projectile.update();
  // }
}

animate()

const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
};

const playerSpeed = 10;
let sequenceNumber = [];
const playerInputs = [];

setInterval(() => {
  if (keys.w.pressed) {
    sequenceNumber++
    playerInputs.push({ sequenceNumber, dx: 0, dy: -playerSpeed })
    frontEndPlayers[socket.id].y -= playerSpeed
    socket.emit('keydown', { keycode: 'KeyW', sequenceNumber })
  }

  if (keys.a.pressed) {
    sequenceNumber++
    playerInputs.push({ sequenceNumber, dx: -playerSpeed, dy: 0 })
    frontEndPlayers[socket.id].x -= playerSpeed
    socket.emit('keydown', { keycode: 'KeyA', sequenceNumber })
  }

  if (keys.s.pressed) {
    sequenceNumber++
    playerInputs.push({ sequenceNumber, dx: 0, dy: playerSpeed })
    frontEndPlayers[socket.id].y += playerSpeed
    socket.emit('keydown', { keycode: 'KeyS', sequenceNumber })
  }

  if (keys.d.pressed) {
    sequenceNumber++
    playerInputs.push({ sequenceNumber, dx: playerSpeed, dy: 0 })
    frontEndPlayers[socket.id].x += playerSpeed
    socket.emit('keydown', { keycode: 'KeyD', sequenceNumber })
  }
}, 15)

window.addEventListener("keydown", (event) => {
  if (!frontEndPlayers[socket.id]) return

  switch (event.code) {
    case 'KeyW':
      keys.w.pressed = true;
      break

    case 'KeyA':
      keys.a.pressed = true;
      break

    case 'KeyS':
      keys.s.pressed = true;
      break

    case 'KeyD':
      keys.d.pressed = true;
      break
  }
});

window.addEventListener('keyup', (event) => {
  if (!frontEndPlayers[socket.id]) return

  switch (event.code) {
    case 'KeyW':
      keys.w.pressed = false;
      break

    case 'KeyA':
      keys.a.pressed = false;
      break

    case 'KeyS':
      keys.s.pressed = false;
      break

    case 'KeyD':
      keys.d.pressed = false;
      break
  }
});