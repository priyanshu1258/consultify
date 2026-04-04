const express = require('express');
const router  = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const crypto  = require('crypto');

// POST /api/bookings — Create new booking (consultee)
router.post('/', protect, async (req, res) => {
  try {
    const { expertId, date, time } = req.body;
    
    // Validate Availability
    const expert = await User.findById(expertId);
    if (!expert || expert.role !== 'expert') {
      return res.status(404).json({ message: 'Expert not found' });
    }
    
    if (!expert.availabilitySlots || expert.availabilitySlots.length === 0) {
      return res.status(400).json({ message: 'Expert has not configured any availability slots yet.' });
    }

    // Parse requested date to Day of Week
    const reqDate = new Date(date);
    const dayOfWeek = reqDate.toLocaleDateString('en-US', { weekday: 'long' }); // e.g. "Monday"

    const availableSlot = expert.availabilitySlots.find(slot => slot.day === dayOfWeek);
    if (!availableSlot) {
      return res.status(400).json({ message: `Expert is not available on ${dayOfWeek}s.` });
    }

    if (time < availableSlot.startTime || time > availableSlot.endTime) {
      return res.status(400).json({ message: `Expert is only available between ${availableSlot.startTime} and ${availableSlot.endTime} on ${dayOfWeek}s.` });
    }

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

// GET /api/bookings/:id — Get details of a specific booking for summary
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('expertId', 'name pricingPerSession bio profilePicture')
      .populate('consulteeId', 'name email');
      
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.consulteeId._id.toString() !== req.user._id.toString() && booking.expertId._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
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

// PUT /api/bookings/:id/pay — Consultee submits UTR
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.consulteeId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorised' });
    }

    const { utrNumber } = req.body;
    if (!utrNumber) return res.status(400).json({ message: 'UTR number is required' });

    booking.utrNumber = utrNumber;
    booking.status = 'payment_submitted';
    const updated = await booking.save();
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
