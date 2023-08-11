const messages = document.getElementById("messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

showMessage = (message) => {
    messages.textContent += `\n\n${message}`;
    messages.scrollTop = messages.scrollHeight;
    userInput.value = '';
}

init = () => {
    if (ws) {
        ws.onerror = ws.onopen = ws.onclose = null;
        ws.close();
    }

    ws = new WebSocket('ws://localhost:3002');
    ws.onopen = () => {
        console.log('Chat connected!');
    }
    ws.onmessage = ({ data }) => showMessage(data);
    ws.onclose = function() {
        ws = null;
    }
}

sendBtn.onclick = () => {
    if (!ws) {
        showMessage('No WebSocket connection');
        return;
    }
    ws.send(userInput.value);
    showMessage(userInput.value);
}

init();