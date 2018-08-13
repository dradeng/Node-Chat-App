'use strict';

function scrollToBottom() {
    //Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');

    //Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

var socket = io();
socket.on('connect', function () {
    console.log('Connected to server.');
    var params = jQuery.deparam(window.location.search);
    socket.emit('join', {name: params.name, room: params.room}, function(ack) {
        if(ack.error) {
            alert(ack.error);
            window.location.href='/';
        } else {
            jQuery('#user-name').text(ack.data.name);
            jQuery('#room-name').text(ack.data.room);
        }
    });

});

socket.on('updateUserList', function(users) {
    var ol = jQuery('<ol></ol>');
    users.forEach(function (name) {
        ol.append(jQuery('<li></li>').text(name));
    });

    jQuery('#users').html(ol);
});

socket.on('newMessage', function(message) {
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('disconnect', function () {
    console.log('Disconnected from server.');
});



var messageTextbox = jQuery('[name=message]');

function handleMessageSendButtonState() {
    var sendMessageButton = jQuery('#send-message');
    if (messageTextbox.val().length == 0 && sendMessageButton.attr('disabled') !== 'disabled') {
        sendMessageButton.attr('disabled', 'disabled');
    } else {
        sendMessageButton.removeAttr('disabled');
    }

}
jQuery('#message-form').on('submit', function(event) {
    event.preventDefault();

    if(messageTextbox.val().length === 0) {
        return;
    }

    socket.emit('createMessage', {
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val('');
        handleMessageSendButtonState();
    });

});

messageTextbox.on('input', handleMessageSendButtonState);
messageTextbox.on('focus', handleMessageSendButtonState);


var locationButton = jQuery('#send-location');
locationButton.on('click', function(event) {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.');
    }
    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, function () {  });
    }, function() {
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch the location.');
    })

});