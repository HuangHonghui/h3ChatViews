/**
 * Created by Administrator on 2015/2/5.
 */
var User = require('../models/Users');
var crypto = require('crypto');
function ensureAuthorized(req, res, next) {

    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        User.findOne({token:bearerToken},function(err,user){
            if(err){
                res.json({
                    type:false,
                    data:"Error: "+ err
                });
            }else{
                if(user){
                    next();
                }else{
                    res.redirect("/login");
                }
            }
        });
        //next();
    } else {
        //res.json({
        //    type:false,
        //    status:403,
        //    message:"Forbidden！"
        //})
        res.status(403).send("Forbidden！");
    }
}
module.exports.ensureAuthorized = ensureAuthorized;

module.exports.hashPassword = function(password){
    return crypto.createHash('sha256').update(password).digest('hex');
};