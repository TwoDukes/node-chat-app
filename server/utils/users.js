/** USER EXAMPLE
[{
    id: '4534$#54h534j5%#$',
    name: 'Dustin',
    room: 'programming chat'
}]
**/

class Users {
    constructor(){
        this.users = [];
    }

    //create a new user
    addUser(id,name, room){
        let newUser = {id, name, room};
        this.users.push(newUser);
        return newUser;
    }
    
    //remove user and return removed user by id
    removeUser(id){
        let removedUser = this.getUser(id);
        if(removedUser){
            this.users = this.users.filter((user) => user.id != id);
        }
        return removedUser;
    }

    //return user by id
    getUser(id){
        return this.users.filter((user) => user.id === id)[0];
    }

    //return users names by room name
    getUserList(room){
        let userList = this.users.filter((user) => user.room === room);
        let userNames = userList.map((user) => user.name);
        return userNames;
    }
}

module.exports = {Users};