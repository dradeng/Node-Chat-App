var users = [];

class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        var userToRemove = this.getUser(id);
        if(userToRemove) {
            this.users = this.users.filter((user) => user.id !== userToRemove.id);
        }
        return userToRemove;
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    getUsersByName(name) {
        return this.users.filter((user) => user.name === name);
    }

    getUserList(room) {
        return this.users
            .filter((user) => user.room === room)
            . map((user) => user.name);
    }

    getRoomList () {
        return this.users
            .map((user) => user.room)
            .filter((room, index, rooms) => {
                return rooms.indexOf(room) == index;
            });
    }

    isRoomExist(roomToCheck) {
        var rooms = this.users
            .map((user => user.room))
            .filter((room) => room === roomToCheck);
        return rooms.length !== 0;
    }

}

module.exports = { Users };