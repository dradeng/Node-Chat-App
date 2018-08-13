'use strict';
var socket = io('/support');
socket.on('connect', function () {
    console.log('connected to the support channel');
});

var roomList = jQuery('#room-list');
socket.on('updateRoomList', function (rooms) {
    console.log(rooms);
    if(rooms.length == 0) {
        rooms.unshift('no existing rooms');
    } else {
        rooms.unshift('join an existing...');
    }
    console.log(rooms);
    roomList.empty();
    rooms.sort().forEach(function (room) {
        roomList.append(jQuery('<option></option>').text(room));
    });
});

roomList.on('change', function(event) {
    var options = event.target.options;
    if(options.selectedIndex > 0) {
        var selected = options[options.selectedIndex].value;
        jQuery('[name=room]').val(selected);
    }
});
