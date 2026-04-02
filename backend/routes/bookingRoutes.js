const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');
const crypto = require('crypto');

// @route   POST /api/bookings
// @desc    Create new booking
router.post('/', protect, async (req, res) => {
  try {
    const { expertId, date, time } = req.body;
    
    // Generate a unique meeting room ID
    const meetingLink = crypto.randomUUID();

    const booking = await Booking.create({
      consulteeId: req.user._id,
      expertId,
      date,
      time,
      meetingLink,
      status: 'pending'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings
// @desc    Get all bookings for logged in user
router.get('/', protect, async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'expert') {
      bookings = await Booking.find({ expertId: req.user._id }).populate('consulteeId', 'name email').sort('-createdAt');
    } else {
      bookings = await Booking.find({ consulteeId: req.user._id }).populate('expertId', 'name email').sort('-createdAt');
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (Expert only usually, but simple check here)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    // Allow expert to accept/reject
    if (booking.expertId.toString() === req.user._id.toString()) {
      booking.status = req.body.status || booking.status;
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(401).json({ message: 'Not authorized to update this booking' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
