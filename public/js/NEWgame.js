const canvas = document.getElementById('canvas1');
const playButtonEl = document.getElementById('play-button');
const startButton = document.getElementById('start-button');

let isGameOver = false;
let playerNum = 0;
let ready = false;
let enemyReady = false;
let currentPlayer = 'user';
let socket = null;

// helper function to toggle box for connections
const playerConnectedOrDisconnected = (num) => {
    let player = `p${parseInt(num) + 1}`
    document.getElementById(`${player}-connected`).classList.toggle('green')
    if (parseInt(num) === playerNum) {
        const current = document.getElementById(`${player}`)
        current.setAttribute('style', 'font-weight: bold');
    }
};

// helper function tp toggle for ready
const playerReady = (num) => {
    let player = `p${parseInt(num) + 1}`
    document.getElementById(`${player}-ready`).classList.toggle('green')
};

// connects player to socket
const connectGame = () => {
    socket = io();

    // get your player number
    socket.on('player-number', num => {
        if (num === -1) {
            console.log("Sorry, the server is full")
        } else {
            playerNum = parseInt(num);
            if (playerNum === 1) {
                currentPlayer = "enemy"
            }
            console.log(playerNum);

            // Get other player status
            socket.emit('check-players')
        }

        // another player has connected/disconnected
        socket.on('player-connection', num => {
            console.log(`Player number ${num} has connected or disconnected`);
            playerConnectedOrDisconnected(num);
        });

        // On enemy ready
        socket.on('enemy-ready', num => {
            enemyReady = true;
            playerReady(num)

            if (ready) {
                playGame(socket);
            }
        });

        socket.on('check-players', (players) => {
            players.forEach((p, i) => {
                if (p.connected) {
                    playerConnectedOrDisconnected(i);
                }
                if (p.ready) {
                    playerReady(i)
                    if (i !== playerNum) {
                        enemyReady = true;
                    }
                }
            })
        });

        startButton.addEventListener('click', () => {
            playGame(socket);
        });
    });
};

const playGame = (socket) => {
    if (isGameOver) {
        return;
    }
    if (!ready) {
        socket.emit('player-ready')
        ready = true;
        playerReady(playerNum)
    }
    if (ready && enemyReady) {
        // TODO put a countdown
        console.log("ready and enemy ready in start game")
        
        setInterval(() => {
            // TODO send mouse movements/key movements
            socket.emit('user-player', currentPlayer);
            console.log('test');
        }, 1000 / 60);

        socket.on('enemy-player', (currentPlayer) => {
            console.log(`${currentPlayer} enemy test?`)
        })

        // animate();

    }
};



playButtonEl.addEventListener("click", connectGame);

