var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    users = {};

app.use(express.static('app'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/2', function(req, res){
    res.sendFile(__dirname + '/2.html');
});

app.get('/3', function(req, res){
    res.sendFile(__dirname + '/3.html');
});

io.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('user message', function (msg) {
        socket.broadcast.emit('user message', socket.nickname, msg);
    });

    socket.on('user', function (userId) {
        users[userId] = socket.id;
        socket.userId = userId;
        io.sockets.emit('users', users);
        console.log(users);
    });

    socket.on('guest', function (guestName, forUserId) {
        socket.guestName = guestName;
        socket.forUserId = forUserId;
        if(users[forUserId]) {
            io.to(users[forUserId]).emit('notifyUser', guestName, 'view', true);
        }
    });

    socket.on('guestSubmit', function (guestName, forUserId) {
        io.to(users[forUserId]).emit('notifyUser', guestName, 'submit', true);
    });

    socket.on('disconnect', function () {
        if (socket.guestName) {
            io.to(users[socket.forUserId]).emit('notifyUser', socket.guestName, 'view', false);
            return;
        }

        delete users[socket.userId];
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});