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

  socket_map[socket.id] = {}

  socket.on('disconnect', function(){
    console.log('user disconnected');
    delete socket_map[socket.id];
  });

  socket.on('chatmessage', function(msg){
    console.log('message: ' + msg);
    var send_msg ;
    if(socket_map[socket.id]['name'] != null)
      send_msg = socket_map[socket.id]['name'] +':' +msg;
    else
      send_msg ='noname' +':' +msg;

    if(socket_map[socket.id]['room'])
      io.to(socket_map[socket.id]['room']).emit('chatmessage', '@' + socket_map[socket.id]['room'] + '_' + send_msg);
    else
      io.emit('chatmessage', send_msg);
  });

  socket.on('set_name', function(name){
    console.log('set_name: ' + name);
    socket_map[socket.id]['name'] = name;
    
  });

  socket.on('room_enter', function(room_name){
    console.log('room_enter: ' + room_name);
    socket.join(room_name);
    socket_map[socket.id]['room'] = room_name;
  });

  socket.on('room_leave', function(room_name){
    console.log('room_leave');
    if(socket_map[socket.id]['room'])
    {
      socket.leave(socket_map[socket.id]['room']);
      delete socket_map[socket.id]['room'];
    }
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
