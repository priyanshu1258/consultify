const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/admin/bookings - Get all bookings pending payment verification
router.get('/bookings', protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find({ status: 'payment_submitted' })
      .populate('consulteeId', 'name email')
      .populate('expertId', 'name email')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/admin/bookings/:id/verify - Verify UTR and confirm booking
router.put('/bookings/:id/verify', protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'confirmed';
    const updated = await booking.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/experts - Get experts pending doc verification
router.get('/experts', protect, adminOnly, async (req, res) => {
  try {
    const experts = await User.find({ 
      role: 'expert', 
      documentsVerified: false,
      'expertDocuments.0': { $exists: true } // Only experts who have uploaded at least one doc
    }).select('-password');
    res.json(experts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/admin/experts/:id/verify-docs - Verify expert documents
router.put('/experts/:id/verify-docs', protect, adminOnly, async (req, res) => {
  try {
    const expert = await User.findById(req.params.id);
    if (!expert || expert.role !== 'expert') {
      return res.status(404).json({ message: 'Expert not found' });
    }

    expert.documentsVerified = true;
    await expert.save();
    res.json({ message: 'Expert documents verified', expert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
