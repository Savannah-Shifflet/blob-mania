const path = require('path');
const express = require('express');
const http = require('http'); 
// const session = require('express-session');
const exphbs = require('express-handlebars');
const socketio = require('socket.io')
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const sequelize = require('./config/connection');
// const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const server = http.createServer(app); 
const io = socketio(server); 

const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });
// Not working at the moment
// const sess = {
//   secret: 'Super secret secret',
//   cookie: {
//     maxAge: 300000,
//     httpOnly: true,
//     secure: false,
//     sameSite: 'strict',
//   },
//   resave: false,
//   saveUninitialized: true,
//   store: new SequelizeStore({
//     db: sequelize
//   })
// };

// app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));

app.use(routes);
server.listen(PORT, () => console.log(`Now listening on ${PORT}`));


const connections = [null, null];
io.on('connection', socket => {
    console.log('New WS connection');
    // find available player number
    let playerIndex = -1;
    for(const i in connections){
        if (connections[i] === null){
            playerIndex = i
            break;
        }
    }
    
    // Tell the connecting client what player number they are
    socket.emit('player-number', playerIndex);

    console.log(`Player ${playerIndex} has connected`);

    // Ignore player 3
    if(playerIndex === -1){
        return;
    }

    connections[playerIndex] = false;

    // Tell everyone what player joined 
    socket.broadcast.emit(
        'player-connection', playerIndex
    );

    // handle disconnect
    socket.on('disconnect', () => {
        console.log(`Player ${playerIndex} disconnected`)
        connections[playerIndex] = null
        // tell everyone what player number just disconnected 
        socket.broadcast.emit('player-connection', playerIndex);
    });

    // On Ready
    socket.on('player-ready', () => {
        socket.broadcast.emit('enemy-ready', playerIndex)
        connections[playerIndex] = true;
    });

    // Check player connections
    socket.on('check-players', () => {
        const players = [];
        for(const i in connections){
            connections[i] === null ? players.push({connected: false, ready:false}) : players.push({connected: true, ready: connections[i]})
        }
        socket.emit('check-players', players);
    })

    socket.on('user-player', (user) => {
        socket.broadcast.emit("enemy-player", user);
    });

    
});