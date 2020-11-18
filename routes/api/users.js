const express = require('express');
const router = express.Router();


// Get users/api
// This is a public unprotected route, no token needed
// Test Route
router.get('/', (req, res) => res.send('Users route'));

module.exports = router;