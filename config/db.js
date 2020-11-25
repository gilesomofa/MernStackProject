const mongoose = require('mongoose'); 
const config = require('config');
const db = config.get('mongoURI');//the mongoURI is the passkey to database

const connectDB = async () => {
    try {
        //this returns a promise therefore needs to await 
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,

        });
        console.log('mongo db connected...');
    } catch (err){
        console.error(err.message);
        //exits process with failure 
        process.exit(1);

    }

}
module.exports = connectDB;