const express = require('express');
const router = express.Router();

// Stub route
router.get('/', (req, res) => {
    res.json({ message: 'Payment routes loaded' });
});

module.exports = router;
