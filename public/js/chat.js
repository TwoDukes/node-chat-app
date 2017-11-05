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

    let template = jQuery('#message-template').html();
    let html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: message.createdAt
    });

    jQuery('#messages').append(html);
    scrollToBotton();
});

//render new location message to chat
socket.on('newLocationMessage', function(message) {
    
    let template = jQuery('#location-message-template').html();
    let html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: message.createdAt
    });
    
    jQuery('#messages').append(html);
    scrollToBotton();
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

//Handles auroscrolling to new messages in chat
function scrollToBotton(){
    //Selectors
    let messages = jQuery('#messages');
    let newMessage = messages.children('li:last-child');
    //Heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();
    const offset = 20;

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight + offset >= scrollHeight){
        messages.animate({ scrollTop: scrollHeight }, 200);
    }
}