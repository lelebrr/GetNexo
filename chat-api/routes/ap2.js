const express = require('express');
const router = express.Router();

// Stub route for AP2
router.get('/', (req, res) => {
    res.json({ message: 'AP2 routes loaded' });
});

module.exports = router;
