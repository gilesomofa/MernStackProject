const express = require('express');
const router = express.Router();
const {check, validationResult} = require("express-validator");
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config'); 

// Route         Post users/api
// Description:  register user
// Access level: Public
router.post('/', [
    //this code is from validator package and handles validation of credentials
    check('name', 'Name is required') .not().isEmpty(),  
    check('email', 'Please enter a valid email address') .isEmail(),
    check('password', 'Password must be 6 or characters') .isLength({ min: 6 })
],
async (req, res) => {
    //represents the object of data that will be sent to this route(needs middleware to parse)
const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
}   

const { name, email, password } = req.body;

//verify that user's credentials arent' being used

try {
    let user = await User.findOne({ email })
    if(user) {
       return res.status(400).json( { errors: [ { msg: 'User already exists' } ] } );
    }

//bring in avatar

const avatar = gravatar.url(email, {
    size: '200',
    r: 'pg',
    d:'mm'
})
user = new User({
    name,
    email,
    avatar,
    password
})

//encrypt password using **** bcrypt ****

//creating a variable to receive promise from brcypt.gensalt 

//passing in the rounds( 10 is industry standard/more rounds more local memory )

//the 'await' saves us from using .then keeping code clean

const salt = await bcrypt.genSalt(10);

user.password = await bcrypt.hash(password, salt);
 
await user.save();


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