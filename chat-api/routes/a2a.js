const express = require('express');
const router = express.Router();

// Stub route for A2A
router.get('/', (req, res) => {
    res.json({ message: 'A2A routes loaded' });
});

module.exports = router;
