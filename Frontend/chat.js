const messages = document.getElementById("messages");
const input = document.getElementById("msgInput");
const sent = document.getElementById("sentBtn");

const API_URL = "https://sarachat-backend.hosting.codeyourfuture.io/messages";

// webscoket connection

const ws = new WebSocket("wss://sarachat-backend.hosting.codeyourfuture.io");

ws.onopen = () => {
    console.log("Connected to websocket server");
}
ws.onmessage = (event) =>{
    const data = JSON.parse(event.data);

    if (data.type == "history")
    {
        messages.innerHTML = "";
        data.messages.forEach(msg => addMessage(msg));
    }
    else if (data.type == "newMessage")
    {
        addMessage(data.message);
    }
}
ws.onclose = () => {
    console.log("Disconnected from websocket server");
}

function addMessage(msg){
    const div = document.createElement("div");
    div.textContent = `${msg.user} : ${msg.text}`;
    messages.appendChild(div);
}

//load previous message from backend (http)
/*
async function loadMessages()
{
    const res = await fetch(API_URL);
    const data = await res.json();
    messages.innerHTML = "";
    data.forEach( msg => {
       const div = document.createElement("div");
       div.textContent = `${msg.user} : ${msg.text}`; 
       messages.appendChild(div);
    });
}
    */


//To show sent message

async function sendMessage()
{
    const text = input.value.trim();
    if (!text) return;

    const message = {text,user: "You"};
    ws.send(JSON.stringify(message));

    /*
    await fetch(API_URL,{
        method : "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text, user: "You"})
    });
    */


    input.value = "";
    //loadMessages();

}

sent.addEventListener("click",sendMessage);

//loadMessages();