const express = require('express');
const router = express.Router();
const Remittance = require('../models/Remittance');

// Create a new remittance
router.post('/', async (req, res) => {
  try {
    const newRemittance = new Remittance(req.body);
    await newRemittance.save();
    res.status(201).json({ success: true, data: newRemittance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all remittances
router.get('/', async (req, res) => {
  try {
    const remittances = await Remittance.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: remittances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
