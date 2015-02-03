/**
 * Created by Administrator on 2015/2/3.
 */
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var io = require('socket.io')(http);


//  连接数据库
mongoose.connect('mongodb://localhost/h3');
var Messages = require("./models/messages.js");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// 设置静态文件路径
app.use(express.static(__dirname,'/dist'));

app.use(bodyParser());

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    Messages.find().exec(function(err,messages){
        if(err) console.error(err);
//console.log(messages);
        socket.emit("msg:init",messages);
    });
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('msg:send',function(msg){
        if(msg&&typeof msg=='object'){

            var newMsg = new Messages(msg);

            newMsg.save(function(err,msgHadSaved){
                if(err) console.error(err);
                socket.broadcast.emit("msg:new", msgHadSaved);
            });
        }

    });
});


http.listen(3000,function(){
    console.log('listen on *:3000');
});