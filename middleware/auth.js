const jwt = require('jsonwebtoken');
const config = require('config');//necessary to access secret

//Using 'jsonwebtoken' and 'config' This middleware acts to protect routes by requiring JWT
//This middleware can be brought in to routes/api wherever we want to require authorization 


module.exports = function  (req, res, next){
    //Get token from header using x-auth-token 
     
    const token = req.header('x-auth-token');

    //check if not token

    if(!token){
        
        return res.status(401).json({ msg: 'No token, authorization denied'});
    }

    //verify token (using jwt.verify method)which receives token and the secret  if there is one and decode it
    //note that we bring in jwtSecret from config to access the id associated with the token. Also here we use 
    //next() as opposed to async await

   try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;
        next();
    } catch (err){
        res.status(401).json({ msg: 'Token is not valid '});

    }
}