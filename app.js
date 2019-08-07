var app = require('express')();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server); 

app.get('/',(req,res) => {
    res.sendFile(__dirname + '/public/index.html');
});
var clients = 0;
var roomno = 1;
io.on('connection', (socket) => {
    //a welcome message to a new client and a no. of clients message to the remaining sockets
    clients++;
    socket.emit('newclientconnect',{description : "hey welcome to the chat !!"});
    socket.broadcast.emit('newclientconnect',{description : clients + "clients connected"});

console.log('a user is connected');
//room num. setup
if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1)roomno++;//max of 2 clients in a room
socket.join("room-"+roomno);
io.sockets.in("room-"+roomno).emit('connecttoroom',"you are in room no."+roomno);//room no. msg to the socket
//chat message event handle
socket.on('chat message',(msg) => {
    io.emit('chat message',msg);
    console.log(msg);
});
//user disconnected event
socket.on('disconnect' , () => {
    clients--;
    io.sockets.emit('newclientconnect',{description : clients + "clients connected"});
    socket.leave("room-"+roomno);
});
});

server.listen(3000,() => {
    console.log('listening on 3000');
});