let clientId = undefined;
let gameId = undefined;

let ws = new WebSocket("ws://localhost:3002");
const btnCreate = document.getElementById("btnCreate");
const btnJoin = document.getElementById("btnJoin");
const txtGameId = document.getElementById("txtGameId");
const divPlayers = document.getElementById("divPlayers");
const newGameEl = document.getElementById("newGameEl");

// wiring events
btnJoin.addEventListener("click", e => {

  if (gameId === undefined) {
    gameId = txtGameId.value;
  }
  const payLoad = {
    "method": "join",
    "clientId": clientId,
    "gameId": gameId,
  };
  console.log('connecting ...')
  ws.send(JSON.stringify(payLoad));
})


btnCreate.addEventListener("click", e => {
  const payLoad = {
    "method": "create",
    "clientId": clientId,
  };
  ws.send(JSON.stringify(payLoad));
})

ws.onmessage = message => {
  // message data
  const response = JSON.parse(message.data);
  // connect
  if (response.method === "connect") {
    clientId = response.clientId;
    console.log("client id set successfully: " + clientId);
  };

  // create
  if (response.method === "create") {
    gameId = response.game.Id;
    console.log("game successfully created with id: " + response.game.id + " with " + response.game.balls + " balls");
    var newGame = document.createElement("p");
    while (newGameEl.childNodes.length > 2) {
      newGameEl.removeChild(newGameEl.lastChild);
    }
    newGame.textContent = ("New game ID: " + response.game.id);
    newGameEl.appendChild(newGame);
  };

  // join
  if (response.method === "join") {
    const game = response.game;

    while (divPlayers.firstChild)
      divPlayers.removeChild(divPlayers.firstChild);

    game.clients.forEach(c => {
      var d = document.createElement("div");
      d.setAttribute("class", "add_player")
      d.textContent = c.clientId;
      divPlayers.appendChild(d);
    })
  };
};

// ======================================================================================= CHATBOX vv

const messages = document.getElementById("messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

showMessage = (message) => {
  messages.textContent += `\n\n${message}`;
  messages.scrollTop = messages.scrollHeight;
  userInput.value = '';
};

init = () => {
  if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
  };

  ws.onopen = () => {
      console.log('Chat connected!');
  };

  ws.onmessage = ({ data }) => showMessage(data);
  ws.onclose = function() {
      ws = null;
  };
};

sendBtn.onclick = () => {
  if (!ws) {
      showMessage('No WebSocket connection');
      return;
  };
  ws.send(userInput.value);
  showMessage(userInput.value);
};

init();