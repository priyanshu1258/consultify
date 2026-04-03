const express = require('express');
const router  = express.Router();
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');
const crypto  = require('crypto');

// POST /api/bookings — Create new booking (consultee)
router.post('/', protect, async (req, res) => {
  try {
    const { expertId, date, time } = req.body;
    const meetingLink = crypto.randomUUID();
    const booking = await Booking.create({
      consulteeId: req.user._id,
      expertId, date, time, meetingLink, status: 'pending'
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/bookings — Get all bookings for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'expert') {
      bookings = await Booking.find({ expertId: req.user._id })
        .populate('consulteeId', 'name email profilePicture')
        .sort('-createdAt');
    } else {
      bookings = await Booking.find({ consulteeId: req.user._id })
        .populate('expertId', 'name email profilePicture skills bio')
        .sort('-createdAt');
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/bookings/:id/status — Accept / Reject + send proposed slot
// Body: { status, proposedDate?, proposedTime?, note? }
router.put('/:id/status', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.expertId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorised to update this booking' });
    }

    const { status, proposedDate, proposedTime, note } = req.body;
    booking.status = status || booking.status;

    if (status === 'accepted') {
      booking.proposedDate = proposedDate || booking.date;
      booking.proposedTime = proposedTime || booking.time;
      booking.note = note || '';
    }

    const updated = await booking.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
