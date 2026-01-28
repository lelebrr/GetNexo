const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

// Analytics Dashboard
router.get('/analytics/dashboard', supportController.getDashboardAnalytics);

// Placeholder for other support routes mentioned in frontend
// router.get('/tickets', supportController.getTickets);
// router.post('/tickets', supportController.createTicket);

module.exports = router;
