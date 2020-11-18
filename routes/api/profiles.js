const express = require('express');
const router = express.Router();


// Get Profiles/api
// This is a public unprotected route, no token needed
// Test Route
router.get('/', (req, res) => res.send('Profiles route'));

module.exports = router;