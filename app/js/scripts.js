$(function () {
    var socket = io();
    
    socket.on('connect', function () {
        var userId = $('#userId').val(),
            guestName = $('#guestName').val(),
            forUserId = $('#forUserId').val();

        if(guestName && forUserId) {
            socket.emit('guest', guestName, forUserId);
        }

        if(userId) {
            socket.emit('user', userId);
        }
    });

    socket.on('notifyUser', function(guestName, entered) {
        if(entered) {
            $('#notifications').append('<li>' + guestName + ' is viewing your invitation</li>');
        } else {
            $('#notifications').append('<li>' + guestName + ' left</li>');
        }
    });
});