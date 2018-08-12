const path = require('path');
const express = require('express')
const socketIO = require('socket.io');
const http = require('http');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const {isRealString} = require('./utils/validation');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);



app.use(express.static(publicPath));


io.on('connection', (socket) => {
	console.log('new user connected');

	socket.on('join', (params, callback) => {

	});

	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			callback('Name and room name are required.');
		}

		server.join(params.room);


		socket.emit('newMessage', generateMessage('Admin', 'welcome to the chat app'));
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
		callback();
	});

	socket.on('createMessage', (message, callback) => {
		
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback();
		
	});

	socket.on('createLocationMessage', (coords) => {
		io.emit('newMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
	});

	socket.on('disconnect', () => {
		console.log('User was disconnected');
	});


});

server.listen(port, () => {
	console.log(`server is up on ${port}`);
});
