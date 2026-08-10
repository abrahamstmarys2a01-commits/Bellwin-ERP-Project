const express = require('express');
const router = express.Router();
const GoldRequest = require('../models/GoldRequest');

// Create a new gold request
router.post('/', async (req, res) => {
  try {
    const newRequest = new GoldRequest(req.body);
    await newRequest.save();
    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all gold requests
router.get('/', async (req, res) => {
  try {
    const requests = await GoldRequest.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
