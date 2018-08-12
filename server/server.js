const path = require('path');
const express = require('express')
const socketIO = require('socket.io');
const http = require('http');
const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);



app.use(express.static(publicPath));


io.on('connection', (socket) => {
	console.log('new user connected');


	socket.emit('newMessage', generateMessage('Admin', 'welcome to chat app'));

	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));


	socket.on('createMessage', (message, callback) => {
		console.log('createMessage', message);
		io.emit('newMessage', generateMessage('Admin', 'welcome to chat app'));
		callback('this is from the server');
		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime();
		// });
	});

	socket.on('disconnect', () => {
		console.log('User was disconnected');
	});


});

server.listen(port, () => {
	console.log(`server is up on ${port}`);
});
