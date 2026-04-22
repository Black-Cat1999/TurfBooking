const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  turfType: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
