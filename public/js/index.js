var socket = io();

socket.on('connect' ,function() {
    console.log('connected to server');   

    socket.emit('createMessage', {
        from: "XxTESTERxX",
        text: "Hey WowZaPowZa!"
    });
});

 socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('New message', function(message) {
    console.log('New message', message);
});