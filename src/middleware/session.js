const jwt = require('jsonwebtoken');

module.exports = function (req,res,next) {
    try
    {
        var token =  req.session.token;
        // console.log(token ,"token");
        if (token == null){
            return res.redirect('/SignIn');
        }
        else {
            jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
                if (err) {
                    res.redirect('/SignIn');
                } 
                else {
                    req.auth = decoded 
                    next() ;                       
                }
            });    
        }
    }
    catch (e) {
        res.status(400).json({
            status: 0,
            message: 'Invalid Token'
        });
    }
};