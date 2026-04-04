const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  consulteeId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expertId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:         { type: String, required: true },   // requested date by consultee
  time:         { type: String, required: true },   // requested time by consultee
  status:       { type: String, enum: ['pending', 'payment_submitted', 'confirmed', 'accepted', 'rejected', 'completed'], default: 'pending' },
  meetingLink:  { type: String },                   // unique room ID
  // Expert proposed slot (sent back to consultee on accept)
  proposedDate: { type: String, default: null },
  proposedTime: { type: String, default: null },
  note:         { type: String, default: '' },      // optional expert message
  utrNumber:    { type: String, default: null },    // after payment
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
