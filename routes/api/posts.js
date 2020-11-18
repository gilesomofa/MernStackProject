const express = require('express');
const router = express.Router();


// Get posts/api
// This is a private protected route, no token needed
// Test Route
router.get('/', (req, res) => res.send('Posts  route'));

module.exports = router;