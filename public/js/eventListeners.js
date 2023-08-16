canvas.addEventListener('click', (event) => {
  const canvas = document.querySelector('canvas')
  const {top, left} = canvas.getBoundingClientRect()
  const playerPosition = {
    x: frontEndPlayers[socket.id].x,
    y: frontEndPlayers[socket.id].y
  }
  const angle = Math.atan2(
    (event.clientY - top) - playerPosition.y,
    (event.clientX - left) - playerPosition.x
  )

  socket.emit('shoot', {
    x: playerPosition.x,
    y: playerPosition.y,
    angle
  })
})

const playButton = document.getElementById('play-btn');
const loginStatus = document.getElementById('login-status');
