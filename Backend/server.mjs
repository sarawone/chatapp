import express from "express";
import cors from "cors";
import fs from "fs";
import { timeStamp } from "console";

const app = express();
const PORT =  3000;

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

app.listen(PORT,() => console.log("Server running on http://localhost:3000"));