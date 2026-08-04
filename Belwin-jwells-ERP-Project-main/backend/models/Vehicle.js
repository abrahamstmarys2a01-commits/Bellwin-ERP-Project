const mongoose = require('mongoose');
const Counter = require('./Counter');
const vehicleSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  company: { type: String, required: true },
  vehicleName: { type: String, required: true },
  model: { type: String, required: true },
  fuelType: { type: String, required: true },
  color: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

vehicleSchema.statics.getNextId = async function () {
  const counter = await Counter.findByIdAndUpdate(
    'vehicleId',
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true }
  );
  return `VEH${String(counter.seq).padStart(4, '0')}`;
};

vehicleSchema.pre('save', async function (next) {
  if (this.isNew && !this.vehicleId) {
    this.vehicleId = await this.constructor.getNextId();
  }
  next();
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
