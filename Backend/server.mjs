import express from "express";
import cors from "cors";
import fs from "fs";
import { timeStamp } from "console";
import {server as WebSocketServer} from "websocket"; // importing the websocket
import http from "http";
const app = express();
const PORT =  3000;

const server = http.createServer(app);   // creating http server
const wsServer = new WebSocketServer ({httpServer:server}); 

app.use(cors());
app.use(express.json());

//file to save messages
const FILE = "messages.json";

//load messages from file
function loadMessages()
{
    if(!fs.existsSync(FILE)) return [];
    const data = fs.readFileSync(FILE,"utf8");
    return JSON.parse(data || "[]");
}

//save the message from file
function saveMessages (messages){
    fs.writeFileSync(FILE,JSON.stringify(messages,null,2));
}

app.get("/messages",(req,res) =>{
    const message = loadMessages();
    res.json(message)
});

app.post("/messages",(req,res)=>{
    const {text,user} = req.body;
    const messages = loadMessages();
    const message = {text,user,timeStamp:new Date()};
    messages.push(message);
    saveMessages(messages);
    res.json({status:"ok",message});

});

//app.listen(PORT,() => console.log("Server running on http://localhost:3000"));

//  webSocket handling

wsServer.on("request",request =>{
    const connection = request.accept(null);
    console.log("New WebSocket connection");

    //load history message 
    connection.sendUTF(JSON.stringify({type : "history",message :loadMessages()}));

    connection.on("message", message => {
        const data = JSON.parse(message);

        const {text ,user}= data;
        const messages = loadMessages();
        const newMsg = {text,user,timeStamp: new Date().toISOString()};
        messages.push(newMsg);
        saveMessages(messages);

        //brodcast to all connect user

        wsServer.connections.forEach(conn => {
            conn.sendUTF(JSON.stringify({type: "newMessage", message :newMsg}));
        });

    });

    connection.on("close",() => console.log("Disconnected..."));

});

server.listen(PORT,() =>{
    console.log("Server running on http://localhost:3000");
});