var PORT = 8008;
 
var options = {
//    'log level': 0
};
 
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server, options);
server.listen(PORT, 'localhost');
 
app.use('/static', express.static(__dirname + '/static'));
 
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
//subscribe to the new client connection event
io.sockets.on('connection', function (client) {
    //subscribe to the message event from the client
    client.on('message', function (message) {
        try {
            //send a message to yourself
            client.emit('message', message);
            //send a message to all customers except yourself
            client.broadcast.emit('message', message);
        } catch (e) {
            console.log(e);
            client.disconnect();
        }
    });
});
