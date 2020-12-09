const jwt = require('jsonwebtoken');
const config = require('config');

//Using 'jsonwebtoken' and 'config' This middleware acts to protect routes by requiring JWT
//This middleware can be brought in to routes/api wherever we want to require authorization 


module.exports = function  (req, res, next){
    //get token from header using x-auth-token  
    const token = req.header('x-auth-token');

    //check if not token
    if(!token){
        //this is the body of the request    
        return res.status(401).json({ msg: 'No token, authorization denied'});
    }

    //verify token (using jwt.verify method)which receives token and the secret  if there is one and decode it
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;
        next();
    } catch (err){
        res.status(401).json({ msg: 'Token is not valid '});

    }
}