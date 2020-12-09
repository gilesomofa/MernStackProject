const express = require('express');
const router = express.Router();

//bring in the middle ware 

const auth = require('../../middleware/auth'); 

//bring in the User model via mongoose from mongo
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config'); 
const {check, validationResult} = require("express-validator");
 
// Get request   to api/auth
// Description: Authenticate user and get token
// Public to make request to use on private routes

//by bringing in the auth middleware and placing as the second parameter, this route becomes protected

router.get('/', auth, async (req, res) =>{
    try {
        //asynchronously query route for authenticated 'user' and exclude password in
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);   
        console.error(error.message);
        res.status(500).send('Server Error ')
}   catch(err){

}
});

//post req to api/auth
//authenticate user and get token
//public

router.post('/', [
    //this code is from validator package and handles validation of credentials
    check('email', 'Please enter a valid email address').isEmail(),
    check('password', 'Password is required').exists()
],
async (req, res) => {
    //represents the object of data that will be sent to this route(needs middleware to parse)
const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
}   

const { email, password  } = req.body;

//verify that user's credentials arent' being used

try {
    let user = await User.findOne({ email })
    //check to see if not user
    if(!user) {
        //send back invalid credential message
       return res.status(400).json( { errors: [ { msg: 'Invalid credentials' } ] } );
    } 

//will match user to password using bcrypt method 'compare'
//create variable to hold value from bcrypt.compare()
//bcrypt.compare takes in plain text password and encrypted user.password that is stored in the user 
//object coming from Mongo

const isMatch = await bcrypt.compare(password, user.password);

//using !isMatch return message stating credentials are invalid
if(!isMatch){
    return res.status(400).json( { errors: [ { msg: 'Invalid credentials' }  ] } );
}

 
//return Jwt 
const payload = {
    user: {
        id: user.id
    }
}
jwt.sign(payload,
        config.get('jwtSecret'),
        {  expiresIn:360000 },
        (err, token) => {
            if(err) throw err;
            //this token will be used as headers in secure routes
            res.json({ token });
        } 
);
}   catch(err){
    console.log(err.message);
    res.status(500).send('Server error');

}});
    

module.exports = router;