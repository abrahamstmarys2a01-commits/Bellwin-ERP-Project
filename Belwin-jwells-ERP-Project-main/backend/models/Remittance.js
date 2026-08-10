const mongoose = require('mongoose');

const remittanceSchema = new mongoose.Schema({
  remittanceNo: { type: String, required: true },
  date: { type: Date, default: Date.now },
  remittanceType: { type: String },
  amount: { type: Number },
  fromPerson: { type: String },
  toPerson: { type: String },
  paymentMode: { type: String },
  referenceNo: { type: String },
  remarks: { type: String },
  enteredBy: { type: String },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Remittance', remittanceSchema);
