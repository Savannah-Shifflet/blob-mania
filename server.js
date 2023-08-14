const path = require('path');
const express = require('express');
const http = require('http'); 
// const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const sequelize = require('./config/connection');
// const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const server = http.createServer(app); 
const { Server } = require('socket.io')
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 })

const PORT = process.env.PORT || 3001;
const hbs = exphbs.create({ helpers });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));

app.use(routes);

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
const backEndPlayers = {};
const backEndProjectiles = {};

let projectileId = 0;

io.on('connection', (socket) => {
  console.log('A user connected');
  // [socket.id] referencing a property
  backEndPlayers[socket.id] = {
    x: 500 * Math.random(),
    y: 500 * Math.random()
  }

  io.emit('updatePlayers', backEndPlayers)

  socket.on('shoot', ({x, y, angle}) => {
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
    console.log(backEndProjectiles)
  })

  // Disconnect the player
  socket.on('disconnect', (reason) => {
    console.log(reason)
    delete backEndPlayers[socket.id]
    // Updating it on frontend too
    io.emit('updatePlayers')
  })

  console.log(backEndPlayers)
});

server.listen(PORT, () => console.log(`Now listening on ${PORT}`));
