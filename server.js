const path = require('path');
const express = require('express');
const http = require('http');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io')
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000, 
    cors: {
        origin: 'https://blob-mania-322037286e7b.herokuapp.com/'
    } });

const PORT = process.env.PORT || 3001;
const sess = {
    secret: 'Super secret secret',
    cookie: {
        maxAge: 300000,
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));

const hbs = exphbs.create({ helpers });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'assets')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
    server.listen(PORT, () => console.log(`Now listening on ${PORT}`));
});

// app.use(session(sess));
const backEndPlayers = {};
const backEndProjectiles = {};

// let backEndLives = 5;
let projectileId = 0;
const PROJECTILE_RADIUS = 5;
const playerSpeed = 3;
const playerRadius = 10;

io.on('connection', (socket) => {
    console.log('A user connected');
    // [socket.id] referencing a property
    backEndPlayers[socket.id] = {
        x: 1200 * Math.random(),
        y: 750 * Math.random(),
        sequenceNumber: 0,
        score: 0,
        lives: 5
    }

    io.emit('updatePlayers', backEndPlayers)

    socket.on('initCanvas', ({ width, height }) => {
        backEndPlayers[socket.id].canvas = {
            width,
            height
        }

        backEndPlayers[socket.id].radius = playerRadius
    })

    socket.on('shoot', ({ x, y, angle }) => {
        projectileId++;

        const velocity = {
            x: Math.cos(angle) * 5,
            y: Math.sin(angle) * 5
        }

        backEndProjectiles[projectileId] = {
            x,
            y,
            velocity,
            playerId: socket.id
        }
    })

    // Disconnect the player
    socket.on('disconnect', (reason) => {
        console.log(reason)
        delete backEndPlayers[socket.id]
        // Updating it on frontend too
        io.emit('updatePlayers')
    })

    // console.log(backEndPlayers)

    socket.on('keydown', ({ keycode, sequenceNumber }) => {
        const backEndPlayer = backEndPlayers[socket.id]

        backEndPlayers[socket.id].sequenceNumber = sequenceNumber
        switch (keycode) {
            case 'KeyW':
                backEndPlayers[socket.id].y -= playerSpeed
                break

            case 'KeyA':
                backEndPlayers[socket.id].x -= playerSpeed
                break

            case 'KeyS':
                backEndPlayers[socket.id].y += playerSpeed
                break

            case 'KeyD':
                backEndPlayers[socket.id].x += playerSpeed
                break
        }

        const playerSides = {
            left: backEndPlayer.x - backEndPlayer.radius,
            right: backEndPlayer.x + backEndPlayer.radius,
            top: backEndPlayer.y - backEndPlayer.radius,
            bottom: backEndPlayer.y + backEndPlayer.radius
        }

        if (playerSides.left < 0) backEndPlayers[socket.id].x = backEndPlayer.radius
        
        if (playerSides.right > 1200)
            backEndPlayers[socket.id].x = 1200 - backEndPlayer.radius

        if (playerSides.top < 0) backEndPlayers[socket.id].y = backEndPlayer.radius
        
        if (playerSides.bottom > 750)
            backEndPlayers[socket.id].y = 750 - backEndPlayer.radius
    })
});

setInterval(() => {
    for (const id in backEndProjectiles) {
        backEndProjectiles[id].x += backEndProjectiles[id].velocity.x
        backEndProjectiles[id].y += backEndProjectiles[id].velocity.y

        if (backEndProjectiles[id].x - PROJECTILE_RADIUS >=
            backEndPlayers[backEndProjectiles[id].playerId]?.canvas?.width ||
            backEndProjectiles[id].x + PROJECTILE_RADIUS <= 0 ||
            backEndProjectiles[id].y - PROJECTILE_RADIUS >=
            backEndPlayers[backEndProjectiles[id].playerId]?.canvas?.height ||
            backEndProjectiles[id].y + PROJECTILE_RADIUS <= 0
        ) {
            delete backEndProjectiles[id]
        continue;
        }
        for (const playerId in backEndPlayers) {
            const backEndPlayer = backEndPlayers[playerId]

            const DISTANCE = Math.hypot(
                backEndProjectiles[id].x - backEndPlayer.x,
                backEndProjectiles[id].y - backEndPlayer.y
            )
            if (DISTANCE < PROJECTILE_RADIUS + backEndPlayer.radius && backEndProjectiles[id].playerId !== playerId) {
                // A player who shot a projectile
                backEndPlayers[backEndProjectiles[id].playerId].score++
                delete backEndProjectiles[id]
                backEndPlayers[playerId].lives--;
                if (backEndPlayers[playerId].lives <= 0) {
                    delete backEndPlayers[playerId]
                    if(Object.keys(backEndPlayers).length === 1){
                        io.emit('gameOver', backEndPlayers); 
                    }
                }
                break;
            }
        }
    }

    io.emit('updateProjectiles', backEndProjectiles)
    io.emit('updatePlayers', backEndPlayers)
}, 15);

module.exports = backEndPlayers;