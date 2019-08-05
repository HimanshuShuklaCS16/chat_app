var app = require('express')();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server); 

app.get('/',(req,res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
console.log('a user is connected');
socket.on('chat message',(msg) => {
    io.emit('chat message',msg);
    console.log(msg);
});
});

server.listen(3000,() => {
    console.log('listening on 3000');
});