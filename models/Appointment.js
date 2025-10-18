const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dateTime: { type: Date, required: true },
  status: { type: String, enum: ['scheduled', 'checked-in', 'complete', 'cancelled'], default: 'scheduled' },
  notes: { type: String },
}, { timestamps: true });

appointmentSchema.index({ dateTime: 1, staff: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
