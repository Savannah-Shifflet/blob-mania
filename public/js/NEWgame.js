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
const frontEndProjectiles = []

// When user joins a game we loop through all backendplayers and if player doesn't exist
socket.on('updatePlayers', (backendPlayers) => {
  for (const id in backendPlayers) {
    const backendPlayer = backendPlayers [id]

    if (!frontEndPlayers[id]) {
      frontEndPlayers[id] = new Player(backendPlayer.x, backendPlayer.y, 10, 'white')
    }
  }
  // Deleting a player from frontend
  for (const id in frontEndPlayers) {
    if (!backendPlayers[id]) {
      delete frontEndPlayers[id]
    }
  }
  console.log(frontEndPlayers)
})

let animationId
// let score = 0
function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  // Loop through frontEndPlayers object
  for (const id in frontEndPlayers) {
    const player = frontEndPlayers[id]
    player.draw()
  }

  for (let i = frontEndProjectiles.length - 1; i >= 0; i--) {
  const projectile = frontEndProjectiles[i];
  console.log(projectile)
  projectile.update();
  }
}

animate()

