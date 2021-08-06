const jwt = require('jsonwebtoken');
const config = require('config');//necessary to access secret

//Using 'jsonwebtoken' and 'config' This middleware acts to protect routes by requiring JWT
//This middleware can be brought into routes/api wherever we want to require authorization 


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
        jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
          if (error) {
            return res.status(401).json({ msg: 'Token is not valid' });
          } else {
            req.user = decoded.user;
            next();
          }
        });
      } catch (err) {
        console.error('something wrong with auth middleware');
        res.status(500).json({ msg: 'Server Error' });
      }
    };
    