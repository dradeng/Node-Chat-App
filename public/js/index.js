
var socket = io();

socket.on('connect', function () {
	console.log('connected to server');



});


socket.on('disconnect', function () {
	console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
	console.log('newMessage', message);
});

socket.emit('createMessage', {
	from: 'Frank',
	text: 'Hi'
}, function(text) {
	console.log('Got it', text);
});
