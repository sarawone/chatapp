const messages = document.getElementById("messages");
const input = document.getElementById("msgInput");
const sent = document.getElementById("sentBtn");

const API_URL = "http://localhost:3000/messages";

//load previous message from backend

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


//To show sent message

async function sendMessage()
{
    const text = input.value.trim();
    if (!text) return;

    await fetch(API_URL,{
        method : "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text, user: "You"})
    });

    input.value = "";
    loadMessages();

}

sent.addEventListener("click",sendMessage);

loadMessages();