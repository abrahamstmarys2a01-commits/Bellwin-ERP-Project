const express = require('express');
const router = express.Router();
const GoldRequest = require('../models/GoldRequest');
const Counter = require('../models/Counter');

// Get next ID preview
router.get('/next-id', async (req, res) => {
  try {
    const counter = await Counter.findById('goldRequestId');
    const nextSeq = (counter?.seq || 0) + 1;
    res.status(200).json({ success: true, nextId: `REQ${String(nextSeq).padStart(6, '0')}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

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
