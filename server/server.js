const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const {Rooms} = require('./utils/rooms');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

//setup the server
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

//serve up our static web page
app.use(express.static(publicPath));

//Initialize users list
let users = new Users();
let rooms = new Rooms();

/** 
//START: HANDLES ALL SOCKET CONNECTIONS TO SERVER
**/
io.on('connection', (socket) => {
    console.log('New user connected');
    socket.emit('updateRoomList', rooms.getCurrentRooms());

    //handles new user joining the chatroom
    socket.on('join', (params, callback) => {
        //Check to see if user filled out neccesary data
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('Display Name and Room name are required')
        }

        //Checks to see if a user already has a name that a new user is trying to use
        if(params.name === users.getUserList(params.room).filter((name) => params.name === name)[0]){
            callback('User in room already has that Display Name')
        }

        //join new socket room
        socket.join(params.room);

        //Update user listing
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        //update room listing
        rooms.addToRoom(params.room);
        io.emit('updateRoomList', rooms.getCurrentRooms());

        //Update user list inside specified socket room
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        //Tell chat new user joined and let user know they have entered the chat
        socket.emit('newMessage', generateMessage('Admin', "Welcome to the chat app!"));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the chat!`));
        callback();
    });


    //Sends messages from a user to all users in socket room
    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);

        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback();
    });

    //broadcasts a users location to all users in socket room
    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);

        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    //lets chatroom know a user has disconnected and updates user list
    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);

        if(user){
            rooms.removeFromRoom(user.room);
            io.emit('updateRoomList', rooms.getCurrentRooms());
            console.log(rooms.getCurrentRooms())
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the chatroom`));
        }
    });

});
/** 
//END: HANDLES ALL SOCKET CONNECTIONS TO SERVER
**/

//server listen on current env port
server.listen(port, (err) => {
    if(err) return console.log(err);
    console.log(`Server listening on port ${port}`);
});