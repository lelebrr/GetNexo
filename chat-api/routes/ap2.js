const express = require('express');
const router = express.Router();
const db = require('../db');
const crypto = require('crypto');

// POST /pay - Initiate Payment (AP2 Intent)
router.post('/pay', (req, res) => {
    try {
        const { amount, currency, agent_id, vdc_token } = req.body;

        if (!amount || !currency || !agent_id) {
            return res.status(400).json({ error: 'Missing payment details' });
        }

        const transactionId = crypto.randomUUID();

        // In a real implementation, we would verify the VDC token here using the AP2 protocol
        // For now, we simulate processing and store the transaction

        const status = 'completed'; // Simulated success

        db.prepare('INSERT INTO ap2_transactions (transaction_id, agent_id, amount, currency, status, vdc_token) VALUES (?, ?, ?, ?, ?, ?)')
          .run(transactionId, agent_id, amount, currency, status, vdc_token || '');

        res.json({
            success: true,
            transaction_id: transactionId,
            status: status,
            message: 'Payment processed successfully via AP2'
        });

    } catch (error) {
        console.error('AP2 Payment Error:', error);
        res.status(500).json({ error: 'Payment processing failed' });
    }
});

// GET /transactions - List AP2 Transactions
router.get('/transactions', (req, res) => {
    try {
        const transactions = db.prepare('SELECT * FROM ap2_transactions ORDER BY created_at DESC').all();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /mandates - Store Payment Mandate (VDC)
router.post('/mandates', (req, res) => {
    try {
        const { type, scope, constraints } = req.body;
        const mandateId = crypto.randomUUID();

        db.prepare('INSERT INTO ap2_mandates (mandate_id, type, scope, constraints) VALUES (?, ?, ?, ?)')
          .run(mandateId, type, scope, JSON.stringify(constraints));

        res.json({ success: true, mandate_id: mandateId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /mandates - List Mandates
router.get('/mandates', (req, res) => {
    try {
        const mandates = db.prepare('SELECT * FROM ap2_mandates ORDER BY created_at DESC').all();
        res.json(mandates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
