var socket = io(); //Set up socket connection

/** 
//START: HANDLE INCOMING MESSAGES
**/
socket.on('connect' ,function() {
    
    //Joins room passing user and room name data
    let params = jQuery.deparam(window.location.search);
    //set room name to be case independant
    params.room = params.room.toLowerCase();
    //emit join request
    socket.emit('join', params, function(err) {
        if(err){
            socket.emit('disconnect');
            alert(err);
            window.location.href = '/';
        }else {
            console.log("No error");
        }
    });
});

 socket.on('disconnect', function() {
    //does nothing currently
});

socket.on('updateUserList', function(users){
    let ol = jQuery('<ol></ol>');
    users.forEach(function(user) {
        ol.append(jQuery("<li></li>").text(user));
    });
    jQuery('#users').html(ol);
});

//render new message to chat
socket.on('newMessage', function(message) {

    if(!document.hasFocus()){ //if window is not in focus then play notification sound
        if(audio.duration > 0 && !audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
        audio.play();
    }

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
var audio = new Audio('../audio/Tiny Button Push-SoundBible.com-513260752.mp3');
audio.volume = 0.3;
audio.play();

/** 
//START: USER DATA SUBMISIONS
**/

//submit new message
jQuery(form).on('submit', function(e) { 
    e.preventDefault(); //Prevents screen refresh on messageTextBox submit

    socket.emit('createMessage', {
        from: "User",
        text: messageTextBox.value 
    }, function() {
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