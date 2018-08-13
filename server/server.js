'use strict';
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage, generateAckOk, generateAckError} = require('./utils/message');
const {isRealString, isInList} = require('./utils/validation');
const {Users} = require('./utils/users');

const PUBLIC_PATH = path.join(__dirname, '../public/'); // avoid /absoluth/path/to/server/../public pattern
const PORT = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(PUBLIC_PATH));
var users = new Users();

var ioSupport = io.of('/support');
ioSupport.on('connection', (socket) => {
    socket.emit('updateRoomList', users.getRoomList());
});

io.on('connection', (socket) => {
    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)) {
            return callback(generateAckError('Name and room name are required.'));
        }

        var room = params.room.toLowerCase();
        var name = params.name;

        if(isInList(name, users.getUserList(room)) || name.toLowerCase() == "admin") {
            return callback(generateAckError(`The user with the same name already exist in ${room} room,\nadmin or Admin are forbidden.`));
        }


        socket.join(room);
        users.removeUser(socket.id);
        users.addUser(socket.id, name, room);

        ioSupport.emit('updateRoomList', users.getRoomList());
        io.to(room).emit('updateUserList', users.getUserList(room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat!'));
        socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${name} joined to the chat.`));

        callback(generateAckOk({name, room}));
    });

    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);

        if(user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback();
    });

    socket.on('createLocationMessage', (coords, callback) => {
        var user = users.getUser(socket.id);

        if(user && coords) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
        callback();
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if(user) {
            ioSupport.emit('updateRoomList', users.getRoomList());
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}.`);
});
