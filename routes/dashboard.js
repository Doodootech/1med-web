const express = require("express");
const router = express.Router();
const app = express();
const socket = i('');
const peer = new peer();


//videocall javascript
peer.on('open', (id)=>{
    socket.emit("newUser", id);
});