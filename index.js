var koa = require('koa');
var app = koa();

//main processing file
var tank = require('./routes/tank');

// 指向静态文件文件夹
// app.use(serve('./public'));

// 必须放在在所有app.user()之后
var server = require('http').Server(app.callback());

tank.initialize(server);

server.listen(3000);
