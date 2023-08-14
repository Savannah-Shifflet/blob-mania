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
    } else {
      if (id === socket.id) {
      // if a player already exists
        players[id].x = backendPlayer.x
        players[id].y = backendPlayer.y

        const lastBackEndInputIndex = playerInputs.findIndex(input => {
          return backendPlayer.sequenceNumber === input.sequenceNumber
        })

        if (lastBackEndInputIndex > -1)
          playerInputs.splice(0, lastBackEndInputIndex + 1)

        playerInputs.forEach(input => {
          players[id].x += input.dx
          players[id].y += input.dy
        })
      } else {
        // for all other players
        // interpolation for lag so player does not teleport due to lag
        gsap.to(players[id], {
          x: backendPlayer.x,
          y: backendPlayer.y,
          duration: 0.015,
          ease: 'linear'
        })
      }
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
    playerInputs.push({sequenceNumber, dx: 0, dy: -playerSpeed})
    players[socket.id].y -= playerSpeed
    socket.emit('keydown', {keycode: 'KeyW', sequenceNumber})
  }

  if (keys.a.pressed) {
    sequenceNumber++
    playerInputs.push({sequenceNumber, dx: -playerSpeed, dy: 0})
    players[socket.id].x -= playerSpeed
    socket.emit('keydown', {keycode: 'KeyA', sequenceNumber})
  }

  if (keys.s.pressed) {
    sequenceNumber++
    playerInputs.push({sequenceNumber, dx: 0, dy: playerSpeed})
    players[socket.id].y += playerSpeed
    socket.emit('keydown', {keycode: 'KeyS', sequenceNumber})
  }

  if (keys.d.pressed) {
    sequenceNumber++
    playerInputs.push({sequenceNumber, dx: playerSpeed, dy: 0})
    players[socket.id].x += playerSpeed
    socket.emit('keydown', {keycode: 'KeyD', sequenceNumber})
  }
}, 15)

window.addEventListener ( "keydown", (event) => {
  if (!players[socket.id]) return

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
  if (!players[socket.id]) return

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