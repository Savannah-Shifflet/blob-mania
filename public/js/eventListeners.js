canvas.addEventListener('click', (event) => {
  const playerPosition = {
    x: frontEndPlayers[socket.id].x,
    y: frontEndPlayers[socket.id].y
  }
  const angle = Math.atan2(
    (event.clientY * window.devicePixelRatio) - playerPosition.y,
    (event.clientX * window.devicePixelRatio) - playerPosition.x
  )
  // const velocity = {
  //   x: Math.cos(angle) * 5,
  //   y: Math.sin(angle) * 5
  // }

  socket.emit('shoot', {
    x: playerPosition.x,
    y: playerPosition.y,
    angle
  })
  // frontEndProjectiles.push(
  //   new Projectile({
  //     x: playerPosition.x,
  //     y: playerPosition.y,
  //     radius: 5,
  //     color: 'white',
  //     velocity: velocity
  //   })
  // )
  console.log(frontEndProjectiles);
})

const playButton = document.getElementById('play-btn');
const loginStatus = document.getElementById('login-status');

// TODO: add event listener to hide the play button and check if the user is logged in when the button is clicked
playButton.addEventListener('click', (event) => {
  playButton.style.display = 'none';
  loginStatus.style.display = 'block';
})