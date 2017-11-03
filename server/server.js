const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

//setup the server
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

//serve up our static web page
app.use(express.static(publicPath));

//Handles all socket connections
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
        
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });

    socket.on('disconnect' , () => {
        console.log('User was disconnected');
    });
});

//server listen on current env port
server.listen(port, (err) => {
    if(err) return console.log(err);
    console.log(`Server listening on port ${port}`);
});