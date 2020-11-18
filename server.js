const express = require('express');//brings in express to our entry file begins building server
const connectDB = require('./config/db');//brings in logic from db.js

const app = express();//initializes app variable with express

//connect Database
 connectDB();

app.get('/', (req, res) => res.send('API RUNNING'));//Checks if API is running

//define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profiles', require('./routes/api/profiles'));



const PORT = process.env.PORT || 5000;//creates environment variable for deployment interface || use local port


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));// verifies that server is running on portapp.use('api/users', require('./routes/api/users'));
