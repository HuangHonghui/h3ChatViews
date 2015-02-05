/**
 * Created by Administrator on 2015/2/5.
 */
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require("../models/Users");
var auth = require("../helpers/auth");

router.get('/',function(req,res){
    res.render('index');
});

router.get('/:name',function(req,res){
    var name = req.params.name;
    res.render(name);
});

router.post('/authenticate',function(req,res){
    User.findOne({
        email:req.body.email,
        password:req.body.password
    },function(err,user){
        if(err){
            res.json({
                type:false,
                data:"Error occured: "+ err
            });
        }else{
            if(user){
                res.json({
                    type:true,
                    data:user,
                    token:user.token
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
router.post('/signin',function(req,res){
    User.findOne({email:req.body.email,password:req.body.password},function(err,user){
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
                userModel.email = req.body.email;
                userModel.password = req.body.password;
                userModel.save(function(err,user){
                    user.token = jwt.sign(user,"1617");
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

module.exports = router;