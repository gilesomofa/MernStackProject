const express = require('express');
const router = express.Router();


// Get auth/api
// This is a public unprotected route, no token needed
// Test Route
router.get('/', (req, res) => res.send('Auth route'));

module.exports = router;