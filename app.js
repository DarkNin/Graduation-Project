var http = require('http');
var IO = require('socket.io');
var express = require('express');
var fs = require('fs');
var path = require('path');


var app = express();
var server = http.Server(app);
app.use(express.static(path.join(__dirname, 'Client')));


var io = IO(server);
var counter = 0;


io.on('connection', function (socket) {
    socket.on('message', function (content) {
        var currentTime = new Date().toTimeString().split(' ');
        counter ++;
        var obj = {
            'time': currentTime[0],
            'counter': counter,
            'content': content
        };
        console.log('No.' + obj.counter +'  received:' + obj.content + obj.time);

        io.emit('message', obj);
    })
});
server.listen(1025);
