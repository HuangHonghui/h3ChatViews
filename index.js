/**
 * Created by Administrator on 2015/2/3.
 */
var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");

console.log();
//var favicon = require('express-favicon');

var server =http.createServer(app);

var io = require('socket.io')(server);
var socketioJwt = require('socketio-jwt');


var jwtSecret = "1617";
var expiresMin = 5;

var routes = require('./routes/index');



//  连接数据库
mongoose.connect('mongodb://localhost/h3');
var Messages = require("./models/messages.js");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));



// 设置静态文件路径
app.use(express.static(__dirname,'/dist'));

// 设置模版引擎，并把文件后缀设置成html
app.engine('html',require('ejs').__express);
app.set('views',path.join(__dirname, 'views'));
app.set('view engine','html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// 允许跨域请求
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.use("/",routes);

// 移到routes/index
//app.get('/', function(req, res){
//    res.sendFile(__dirname + '/index.html');
//});

//io.set('authorization',socketioJwt.authorize({
//    secret: jwtSecret,
//    handshake: true
//}));
io.use(socketioJwt.authorize({
    secret: jwtSecret,
    handshake: true,
    timeout: 6000
}));

io.on('connection', function(socket){
    console.log(socket.decoded_token.email, 'connected');
    console.log(socket.decoded_token,'a user connected');

    socket.emit("user:initName",socket.decoded_token.userName);
    Messages.find().exec(function(err,messages){
        if(err) console.error(err);
//console.log(messages);
        socket.emit("msg:init",messages);
    });
    socket.on('disconnect', function(a){
        console.log('user disconnected',a);
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
setInterval(function () {
    io.sockets.emit('time', Date());
}, 5000);


server.listen(3000,function(){
    console.log('listen on *:3000','good');
});