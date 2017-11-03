var socket = io(); //Set up socket connection

/** 
//START: HANDLE INCOMING MESSAGES
**/
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
/** 
//END: HANDLE INCOMING MESSAGES
**/

//DOM Variables
const form = document.querySelector('#message-form');
const input = document.querySelector('[name=message]');
const locationButton = document.querySelector('#send-location');

/** 
//START: USER DATA SUBMISIONS
**/

//submit new message
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

//send location data
jQuery(locationButton).on('click', function() {
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(function(position){
        console.log(position);
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function(){
        alert('Unable to fetch your location')
    });
});

/** 
//END: USER DATA SUBMISIONS
**/