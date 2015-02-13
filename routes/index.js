/**
 * Created by Administrator on 2015/2/5.
 */
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require("../models/Users");
var auth = require("../helpers/auth");
var jwtSecret = "1617";
var expiresMin = 5;

router.get('/', function(req,res){
    res.render('index');
});

//router.get('/:name',function(req,res){
//    var name = req.params.name;
//    res.render(name);
//});

// login
router.post('/authenticate',function(req,res){
    User.findOne({
        email:req.body.email,
        password:auth.hashPassword(req.body.password)
    },function(err,user){
        if(err){
            res.json({
                type:false,
                data:"Error occured: "+ err
            });
        }else{
            if(user){
                // todo: 更新token
                user.token = jwt.sign({
                    userName:user.userName,
                    email:user.email,
                    password:user.password
                },jwtSecret,{ expiresInMinutes: expiresMin });
                user.save(function(err,userSaved){
                    res.json({
                        type:true,
                        data:userSaved,
                        token:userSaved.token
                    })
                });
            }else{
                res.json({
                    type:false,
                    data:"Incorrect email/password"
                })
            }
        }
    });

});
// register
router.post('/signin',function(req,res){
    User.findOne({
        email:req.body.email,
        password:auth.hashPassword(req.body.password)
    },function(err,user){
        if(err){
            res.json({
                type:false,
                data:"Error occured: " + err
            });
        }else{
            if(user){
                res.json({
                    type:false,
                    data:"User already exists!"
                });
            }else{
                var userModel = new User();
                userModel.userName = req.body.userName;
                userModel.email = req.body.email;
                userModel.password = auth.hashPassword(req.body.password);
                userModel.save(function(err,user){
                    user.token = jwt.sign({
                        userName:user.userName,
                        email:user.email,
                        password:user.password // 数据库拿出来的。
                    },jwtSecret,{ expiresInMinutes: expiresMin });
                    user.save(function(err,userSaved){
                        res.json({
                            type:true,
                            data:userSaved,
                            token:userSaved.token
                        })
                    });
                });
            }
        }
    });
});

router.post('/logout',function(req,res){
    if(req.body.token){
        var user = jwt.decode(req.body.token);
        // TODO: 改变用户在线状态等等操作。
        console.log(user,"off");
        res.json({
            type:true,
            data:"logout success"
        });
    }



});

router.get('/api/me',auth.ensureAuthorized,function(req, res){
    User.findOne({token:req.token},function(err,user){
        if(err){
            res.json({
                type:false,
                data:"Error occured: " + err
            });
        }else{
            res.json({
                type:true,
                data:user
            })
        }
    })
});

//router.get('/api/deleteUsers',function(req,res){
//    User.find().remove().exec(function(err,user){
//console.log('delete');
//        User.find().exec(function(err,users){
//console.log(users)
//        });
//    });
//});
router.get("*",function(req,res){
    res.status(404).send("Not Found!");
});

module.exports = router;