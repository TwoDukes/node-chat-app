var socket = io();

socket.on('connect' ,function() {
    console.log('connected to server');   

});

 socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
    console.log('newMessage', message);
    
    let li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
});

let form = document.querySelector('#message-form');
let input = document.querySelector('[name=message]');

jQuery(form).on('submit', function(e) { 
    e.preventDefault(); //Prevents screen refresh on input submit

    socket.emit('createMessage', {
        from: "User",
        text: input.value //short hand query selector
    }, function(data) {
        console.log(data);
        input.value = '';
    });
});