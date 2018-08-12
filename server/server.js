const path = require('path');
const express = require('express')
const socketIO = require('socket.io');
const http = require('http');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);



app.use(express.static(publicPath));


io.on('connection', (socket) => {
	console.log('new user connected');

	socket.emit('newMessage', {
		from: 'mike@me.com',
		text: 'see u then',
		createdAt: '123'
	});

	socket.on('createEmail', (newEmail) => {
		console.log('createEmail', newEmail);
	});

	socket.on('createMessage', (message) => {
		console.log('createMessage', message);
	});

	socket.on('disconnect', () => {
		console.log('User was disconnected');
	});


});

server.listen(port, () => {
	console.log(`server is up on ${port}`);
});
