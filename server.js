var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var BINARY_MESSUP_PR=0.04;

var users = [];
var connections = [];

var port = process.env.PORT || 3000;

server.listen(port);
console.log("server.js is running");

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html");
});


io.sockets.on('connection', function(socket){
  connections.push(socket);
  io.sockets.emit('AConnect', {id: socket.id});

  socket.BINARY_MESSUP_PR = BINARY_MESSUP_PR;

  for (var i = 0; i < connections.length; i++)
  {
  	var unmc = null;
  	if (i < users.length)
  	{
  		unmc = users[i];
  	}
  	var data = {
  		id: socket.id,
  		name: unmc,
  		conn: connections[i].id
  	}
  	console.log(data);
  	io.sockets.emit('ConnectInfo', data);
  }

  console.log("Connected: %s sockets connected", connections.length);

  //disconect
  socket.on('disconnect', function(data) {
    io.sockets.emit('ADisconnect', {id: socket.id});
    connections.splice(connections.indexOf(socket), 1);
    console.log("Connected: %s sockets connected", connections.length);
  });

  //send message
  socket.on('send message', function(data){
  	socket.BINARY_MESSUP_PR = BINARY_MESSUP_PR;
    io.sockets.emit('new message', {msg: data, bmp: BINARY_MESSUP_PR});
  });

  socket.on('sendName', function(data){
    users.push(data.name);
    for (var i = 0; i < users.length; i++)
    {
      io.sockets.emit('recieveName', {msg: data});
    }
  });

  socket.on('ChangePr', function(data){
  	BINARY_MESSUP_PR = data.newVal;
  	io.sockets.emit('ChangePr', data);
  });

  socket.on('KILL',function(data){
  	io.sockets.emit('DIE', data);
  });

});
