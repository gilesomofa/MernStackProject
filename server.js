const express = require('express');//brings in express to our entry file begins building server

const app = express();//initializes app variable with express

app.get('/', (req, res) => res.send('API RUNNING'));//Checks if API is running


const PORT = process.env.PORT || 5000;//creates environment variable for deployment interface || use local port


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));