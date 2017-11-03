const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');

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

    //handles new user joining the chatroom
    socket.emit('newMessage', generateMessage('Admin', "Welcome to the chat app!"));
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user has joined the chatroom!'));

    //Sends messages from a user to all users
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);

        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('Message sent - Server');
    });
    
    //lets chatroom know a user has disconnected
    socket.on('disconnect' , () => {
        console.log('User was disconnected');
        socket.broadcast.emit('newMessage', generateMessage('Admin', 'User has left the chatroom'));
    });

    //broadcasts a users location
    socket.on('createLocationMessage', (coords) => {
        console.log(coords.latitude, coords.longitude);
        io.emit('newMessage', generateMessage('Admin', `${coords.latitude}, ${coords.longitude}`));
    });
});

//server listen on current env port
server.listen(port, (err) => {
    if(err) return console.log(err);
    console.log(`Server listening on port ${port}`);
});