const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const socket = io()

const scoreEl = document.querySelector('#scoreEl')

canvas.width = 850;
canvas.height = 850;

const x = canvas.width / 2
const y = canvas.height / 2

const player = new Player(x, y, 10, 'white')
const players = {}
// When user joins a game we loop through all backendplayers and if player doesn't exist
socket.on('updatePlayers', (backendPlayers) => {
  for (const id in backendPlayers) {
    const backendPlayer = backendPlayers [id]

    if (!players[id]) {
      players[id] = new Player(backendPlayer.x, backendPlayer.y, 10, 'white')
    }
  }
  // Deleting a player from frontend
  for (const id in players) {
    if (!backendPlayers[id]) {
      delete players[id]
    }
  }
  console.log(players)
})

let animationId
// let score = 0
function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  // Loop through players object
  for (const id in players) {
    const player = players[id]
    player.draw()
  }
}

animate()

