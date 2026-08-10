const mongoose = require('mongoose');

const goldRequestSchema = new mongoose.Schema({
  requestNo: { type: String, required: true },
  date: { type: Date, default: Date.now },
  itemName: { type: String },
  goldType: { type: String },
  weight: { type: Number },
  purity: { type: String },
  quantity: { type: Number },
  reason: { type: String },
  requestedTo: { type: String },
  status: { type: String, default: 'Pending' },
  remarks: { type: String },
  requestedBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('GoldRequest', goldRequestSchema);
