//Example of room
// [{
//     name: "Room",
//     userCount: 25
// }]

const {isRealString} = require('./validation');

class Rooms {
    constructor(){
        this.rooms = [];
    }

    //create a new user
    addToRoom(name){

            if(isRealString(name)){
            let curRoom = this.rooms.filter((room) => name === room.name);
            //if room exists
            if(curRoom.length > 0){
                curRoom[0].userCount++;
                return curRoom[0];
            }else{
                let newRoom = {
                    name: name,
                    userCount: 1
                }
                this.rooms.push(newRoom);
                return newRoom;
            }
        }
    }
    
    //remove user and return removed user by id
    removeFromRoom(name){
        let curRoom = this.rooms.filter((room) => name === room.name);
        //if room exists
        if(curRoom.length > 0){
            //lower user count
            curRoom[0].userCount--;
            //if count is at zero remove the room
            if(curRoom[0].userCount <= 0){
                this.rooms = this.rooms.filter((room) => room.name != name);
            }
        }else{
            return undefined; //cannot remove user from room that does not exist
        }
    }

    getCurrentRooms(){
        return this.rooms;
    }


}

module.exports = {Rooms};