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

//render new message to chat
socket.on('newMessage', function(message) {
 
    let li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
});

//render new location message to chat
socket.on('newLocationMessage', function(message) {
    let li = jQuery('<li></li>');
    let a = jQuery('<a target="__blank">My current location</a>');

    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});
/** 
//END: HANDLE INCOMING MESSAGES
**/

//DOM Variables
const form = document.querySelector('#message-form');
const messageTextBox = document.querySelector('[name=message]');
const locationButton = document.querySelector('#send-location');

/** 
//START: USER DATA SUBMISIONS
**/

//submit new message
jQuery(form).on('submit', function(e) { 
    e.preventDefault(); //Prevents screen refresh on messageTextBox submit

    socket.emit('createMessage', {
        from: "User",
        text: messageTextBox.value //short hand query selector
    }, function(data) {
        messageTextBox.value = '';
    });
});

//send location data
jQuery(locationButton).on('click', function() {
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }
    //disabled button and store inner html
    let tempLocText = locationButton.innerHTML;
    locationButton.setAttribute('disabled', 'disabled');
    locationButton.innerHTML = "Sending Location...";

    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        //re-enable button and reset inner html
        locationButton.removeAttribute('disabled');
        locationButton.innerHTML = tempLocText;
    }, function(){
        //re-enable button and reset inner html
        locationButton.setAttribute('disabled');
        locationButton.innerHTML = tempLocText;
        alert('Unable to fetch your location')
    });
});

/** 
//END: USER DATA SUBMISIONS
**/