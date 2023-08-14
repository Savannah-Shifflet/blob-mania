const path = require('path');
const express = require('express');
// const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');
// const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
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

//initialize server requirements
const http = require("http");
const websocketServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(3002, () => console.log("listening... on 3001"))

// hashmap
const clients = {};
const games = {}

const wsServer = new websocketServer({
  "httpServer": httpServer,
})

wsServer.on("request", request => {
  // someone trying to connect
  const connection = request.accept(null, request.origin)
  connection.on("open", () => console.log("opened!"));
  connection.on("close", () => console.log("closed!"));
  connection.on("message", message => {
    // I have recieved a message from the client
    const result = JSON.parse(message.utf8Data)
    if (result.method === "create") {
      const clientId = result.clientId
      const gameId = guid();
      games[gameId] = {
        "id": gameId,
        "balls": 20,
        "clients": [],
      }

      const payLoad = {
        "method": "create",
        "game": games[gameId],
      }

      const con = clients[clientId].connection;
      con.send(JSON.stringify(payLoad));
    };

    if (result.method === "join") {
      const clientId = result.clientId;
      const gameId = result.gameId;
      const game = games[gameId];

      if (game.clients.length >= 4) {
        // max reached
        return;
      }

      const color = { "0": "Red", "1": "Blue", "2": "Green", "3": "Yellow" }[game.clients.length]
      game.clients.push({
        "clientId": clientId,
        "color": color,
      });

      const payLoad = {
        "method": "join",
        "game": game,
      }

      // loop through all clients and tell them someone joined
      game.clients.forEach(c => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })
    };

    // PLAY STATE UPDATE SERVER 
    // if (result.method === "play") {
    //   const clientId = result.clientId
    //   const gameId = result.gameId

    //   const state = games[gameId].state
    // };
  });

  // generate a new clientId
  const clientId = guid();
  clients[clientId] = {
    "connection": connection,
  }

  const payLoad = {
    "method": "connect",
    "clientId": clientId,
  }

  // send back the client connect
  connection.send(JSON.stringify(payLoad));
});

const guid = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
}

app.listen(PORT, () => console.log('Now listening'));
