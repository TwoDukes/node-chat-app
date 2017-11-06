var socket = io(); //Set up socket connection

const form = jQuery('#join-form');
const nameTextBox = jQuery('[name=name]');
const roomTextBox = jQuery('[name=room]');
const dropdownBtn = jQuery('#dropbtn');
const dropdownHolder = jQuery('#myDropdown');



/** 
//START: HANDLE INCOMING EMITS
**/
socket.on('connect' ,function() {
    console.log('connected to server');
});

 socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('updateRoomList', function(rooms){
    
    let ol = jQuery('<ol></ol>');
    
    if(rooms.length > 0){

    let template = jQuery('#room-list-template').html();
    //Foreach room generate a new room list template and append it to an ordered list
    rooms.forEach(function(room) {
        let html = Mustache.render(template, {
            name: room.name,
            userCount: room.userCount,
        });

        ol.append(jQuery(html));
    });
} else{
    let template = jQuery('#no-room-template').html();

    let html = Mustache.render(template, {
        name: "No rooms currently active",
    });

    ol.append(jQuery(html));
}

    //Fill the dropdownHolder with the newly generated ordered list
    jQuery(dropdownHolder).html(ol);
    console.log("updated rooms");
});


/** 
//END: HANDLE INCOMING EMITS
**/

jQuery(dropdownBtn).click(function(){
    dropdownHolder.toggleClass('show');
}); 

//adds room clicked on into Room name textbox
jQuery(dropdownHolder).click(function(event){
    let roomName = event.target.getAttribute('data-room');
    if(roomName != null)
        roomTextBox.val(roomName);
});

//Handle form submission and textbox error checking
jQuery(form).on('submit', function(e) { 
    e.preventDefault(); //Prevents screen refresh on form submit

    //checks if name and room name textbox are filled correctly
    if(!isRealString(nameTextBox.val()) || !isRealString(roomTextBox.val())){
        return alert('Display Name and Room name are required');
    } else{
        //generate url based on form data and sent user to new chat room
        const url = `/chat.html?${jQuery.param({name: nameTextBox.val(), room: roomTextBox.val()})}`;
        window.location.href = url;
    }
});



function isRealString(str){
    return typeof str === 'string' && str.trim().length > 0;
};