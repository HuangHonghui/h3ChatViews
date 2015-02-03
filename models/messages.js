/**
 * Created by Administrator on 2015/2/3.
 */
var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var MessagesSchema = new Schema({
    userName: String,
    body:String,
    created: {type:Date, default:Date.now}
});

var Messages = mongoose.model("Messages", MessagesSchema);

module.exports = Messages;