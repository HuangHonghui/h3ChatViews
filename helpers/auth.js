/**
 * Created by Administrator on 2015/2/5.
 */
function ensureAuthorized(req, res, next) {
    console.log(req.headers);
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        //res.json({
        //    type:false,
        //    status:403,
        //    message:"Forbidden！"
        //})
        res.send(403,"Forbidden！");
    }
}
module.exports.ensureAuthorized = ensureAuthorized;