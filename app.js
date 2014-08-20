var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var socket_map = {};

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  console.log(socket.id);

  socket.on('disconnect', function(){
    console.log('user disconnected');
    delete socket_map[socket.id];
  });

  socket.on('chatmessage', function(msg){
    console.log('message: ' + msg);
    if(socket_map[socket.id] != null)
      io.emit('chatmessage', socket_map[socket.id] +':' +msg);
    else
      io.emit('chatmessage', 'noname' +':' +msg);
  });

  socket.on('set_name', function(name){
    console.log('set_name: ' + name);
    socket_map[socket.id] = name;
    
  });


});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
