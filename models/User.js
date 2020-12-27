//This Model with it's Schema allows us to interact with the database
// We use mongoose tool to create schema. Mongoose was installed as a node package

const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    // this is very important, bc this value will be used as unique key 
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar:{
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
}); 

module.exports = User = mongoose.model('user', UserSchema);