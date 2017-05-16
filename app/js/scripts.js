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

socket.on('notifyUser', function(guestName, type, resp) {
    switch(type) {
        case 'view':
            if(resp) {
                $('#notifications').append('<li class="notif-' + guestName + ' online"><i></i>' + guestName + ' is viewing your invitation</li>');
            } else {
                $('#notifications').find('.notif-' + guestName + '').removeClass('online');
                $('#notifications').append('<li class="notif-' + guestName + '">' + guestName + ' left</li>');
            }
            break;
        case 'submit':
            if(resp) {
                $('#notifications').append('<li class="notif-' + guestName + '">' + guestName + ' responded to your invitation</li>');
            }
    }
});

$(function () {
    $('#sendResponse').on('submit', function(e) {
        e.preventDefault();
        var guestName = $('#guestName').val(),
            forUserId = $('#forUserId').val();

        socket.emit('guestSubmit', guestName, forUserId);
    });
});