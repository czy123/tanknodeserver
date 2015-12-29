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
      that.tankrotation(socket);
      that.disconnect(socket);
      that.tankshoot(socket);
      that.tanklife(socket);
  })
}

tank.tanklife = function(socket){
  var that =this;
  socket.on('ReciveLife',function(msg){
    console.log(msg);
    socket.broadcast.emit('enemylife',{
      ismytank:msg.ismytank,
      damagelife:msg.damagelife
    });
  })
}

tank.tankshoot = function(socket){
  var that = this;
  socket.on('SendFireInfo',function(msg){
    console.log(that.userName[socket.id]+'shoot');
    socket.broadcast.emit('ReciveFire',{
      name:that.userName[socket.id]
    });
  })
}

tank.addplayer = function(socket){
  var that = this;
  socket.on('create player',function(msgs){
    for(var p in tank.userName){
      socket.emit('new user', {
        name:msgs.name,
        color:msgs.color,
        enemy:true
      });
     }

    if (that.usedName.indexOf(msgs.name) === -1) {
      console.log('that.usedName'+that.usedName);
      var nameIndex = that.usedName.indexOf(that.userName[socket.id]);
      that.usedName.push(msgs.name);
      that.userName[socket.id] = msgs.name;
      that.usedName[nameIndex] = msgs.name;
      var msg = msgs.name + 'enter the room! Welcome!';
      console.log(msg);
      socket.broadcast.emit('new user', {
        name:msgs.name,
        color:msgs.color,
        enemy:true
      });
      socket.emit('new user', {
        name:msgs.name,
        color:msgs.color,
        enemy:false
      });
      console.log(that.userName);
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
    socket.broadcast.emit('PlayerRotato',{
        name : data.name,
        Positiony : data.y
    });
  });
}

tank.tankmove = function(socket){
  var that = this;
  socket.on('move', function (data){
      socket.broadcast.emit('PlayerMove', {
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
    console.log(msg);
    socket.broadcast.emit('exit user',{
      name:that.userName[socket.id]
    });

    var nameIndex = that.usedName.indexOf(that.userName[socket.id]);

    delete that.userName[socket.id];
    delete that.usedName[nameIndex];

    delete that.currentRoom[socket.id];
  });
}

module.exports = tank;
