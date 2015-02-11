/**
 * Created by Administrator on 2015/2/5.
 */
var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var UsersSchema = new Schema({
    userName:String,
    email: String,
    password:String,
    token:String
});

var Users = mongoose.model("Users", UsersSchema);

module.exports = Users;