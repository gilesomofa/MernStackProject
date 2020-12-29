const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profiles');
const User = require('../../models/User');

// Get api/profile/me
// get current users profile
// private 


//this route will be for the user's profile 
router.get('/me', auth,  async (req, res) => {
    try{
        //write query to Mongo to get values of user to be used to create user value in profile 
        const profile = await  Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']); 
        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for user' });
        }

        res.json(profile);
    }   catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }  
});

// Post api/profile
// create or update user profile
// private

router.post(
    '/', 
    //the below brings in auth middleware to secure route and following that
    //is the express validator method 'check' which validates user profile skills and status
    [
   auth, 
        [
    check('status', 'Status is required')
    .not()
    .isEmpty(),
    check('skills', 'Skills is required')
]
],
async (req, res) => {
    //since this route will be able to create new profile, it must be secured
    //with validationResult from express-validator
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json( { errors: errors.array() });
    }
    const{
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
     } = req.body
     
     //Build profile object

     const profileFields = {};

     //allow access to the user through req.user.id (which has token attached)
     profileFields.user = req.user.id;

     if(company) profileFields.company = company; 
     if(website) profileFields.website = website;
     if(location) profileFields.location = location;
     if(bio) profileFields.bio = bio;
     if(status) profileFields.status = status;
     if(githubusername) profileFields.githubusername = githubusername; 
     
     // Since skills has multiple items, it must be received with the ability to
     //store an array, hence the following code
     if(skills) {
     profileFields.skills = skills.split(',').map(skill => skill.trim());

    } 
    console.log(profileFields.skills)
    res.send('hello')
    //Initialize social object 
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {

        //Remember, when using mongoose methods we get a promise
        //Hence  'async'- 'await' - don't forget!!
        //Also, note findOneAndUpdate mongoose method and syntax

        let profile = await Profile.findOne({ user: req.user.id });

        if(profile) {
            //update profile if one exists

            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { set: profileFields },
                { new: true }
                );
                return res.json(profile);
        }
        //  If there is no profile Create a new one

        profile = new Profile(profileFields);

        await profile.save()
        res.json(profile)

    } catch(err) {
        console.error(err.message);  
        res.status(500).send('Server Error');
    }
}
); 

// @route  Get api/profile
// @description  Get all profiles
// @access Public

router.get('/', async (req,res) =>{
    try {
        const profiles = await Profile.find().populate('user', [ 'name', 'avatar']);
        res.json(profiles);  
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }  
});

// @route  Get api/profile/user/:user_id  
// @description  Get profile by user ID
// @access Public  

router.get('/user/:user_id', async (req,res) =>{
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', [ 'name', 'avatar']);

        if(!profile) return res.stautus(400).json({ msg: 'Profile not found'});

        res.json(profile);  
    } catch (err) {
        console.error(err.message);

        if(err.kind == 'ObjectId'){
            return res.stautus(400).json({ msg: 'Profile not found'});
        }
        res.status(500).send('Server Error')
    }  
});
// @route  Delete api/profile
// @description  Delete  profile, user, and posts
// @access Private

router.delete('/', auth, async (req,res) =>{
    try {
        //@todo - remove users posts

        //remove profile
         await Profile.findOneAndRemove( {user: req.user.id });
         //Remove user
         await User.findOneAndRemove( {_id: req.user.id });
        res.json('user removed')
        res.json(profiles);  
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }  
});

// @route  Put api/profile/experience
// @description  Add profile experience
// @access Private


module.exports = router;