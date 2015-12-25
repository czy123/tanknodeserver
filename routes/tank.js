//socket io module
var socketIo = require('socket.io');

// create a new ojbect chat
var tank = {};

//user name
tank.userName = {};
//name has been used
tank.usedName = [];
//user number
tank.userNum = 0;

tank.io = false;

tank.initialize = function(http){
  this.io = socketIo(http);
	this.ioListen();
}

//重要网络监听方法
tank.ioListen = function(){
    console.log("connection");
    var that = this;
    this.io.on('connection',function(socket){
      that.addplayer(socket);
      that.tankmove(socket);
      that.disconnect(socket);
  })
}

tank.addplayer = function(socket){
  var that = this;
  socket.on('create player',function(msgs){
    console.log(that.usedName.indexOf(msgs.name));
    if (that.usedName.indexOf(msgs.name) === -1) {
      console.log('that.usedName'+that.usedName);
      var nameIndex = that.usedName.indexOf(that.userName[socket.id]);
      that.usedName.push(msgs.name);
      that.userName[socket.id] = msgs.name;
      that.usedName[nameIndex] = msgs.name;
      var msg = msgs.name + 'enter the room! Welcome!';
      console.log(msg);
      socket.emit('new user', {
        name:msgs.name,
        color:msgs.color
      });
      console.log('emit user');
    }else {
      console.log('名字已经被使用');
      socket.emit('sys message',{
        err : '名字已经被使用'
      });
    }

  });
}

tank.tankrotation = function(socket){
  socket.on('rotation',function(data){
    socket.emit('PlayerRotato',{
        name : data.name,
        Positiony : data.y
    });
  });
}

tank.tankmove = function(socket){
  socket.on('move', function (data){
      socket.emit('PlayerMove', {
          name : data.name,
          Position : data.position
      });
      // console.log(data.name + " move to " + data.position);
  });
}

//失去连接
tank.disconnect = function(socket){
  var that = this;
  socket.on('disconnect',function(){
    var msg = that.userName[socket.id] + 'just left';

    socket.emit('exit user',msg);

    var nameIndex = that.usedName.indexOf(that.userName[socket.id]);

    delete that.userName[socket.id];
    delete that.usedName[nameIndex];

    delete that.currentRoom[socket.id];
  });
}

module.exports = tank;
