const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const { protect } = require("../middleware/auth");
const crypto = require("crypto");

// POST /api/bookings — Create new booking (consultee)
router.post("/", protect, async (req, res) => {
  try {
    const { expertId, date, time, transactionId } = req.body;
    const meetingLink = crypto.randomUUID();
    const booking = await Booking.create({
      consulteeId: req.user._id,
      expertId,
      date,
      time,
      meetingLink,
      transactionId,
      status: "pending_admin",
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/bookings — Get all bookings for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    let bookings;
    if (req.user.role === "expert") {
      bookings = await Booking.find({
        expertId: req.user._id,
        status: { $ne: "pending_admin" },
      })
        .populate("consulteeId", "name email profilePicture")
        .sort("-createdAt");
    } else {
      bookings = await Booking.find({ consulteeId: req.user._id })
        .populate("expertId", "name email profilePicture skills bio")
        .sort("-createdAt");
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/bookings/:id/status — Accept / Reject + send proposed slot
// Body: { status, proposedDate?, proposedTime?, note? }
router.put("/:id/status", protect, async (req, res) => {
  try {
    console.log(`[BookingStatus] id=${req.params.id} user=${req.user?._id} body=`, req.body);
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    console.log(`[BookingStatus] booking.expertId=${booking.expertId} req.user._id=${req.user._id}`);

    if (booking.expertId.toString() !== req.user._id.toString()) {
      console.log(`[BookingStatus] UNAUTHORIZED: expertId mismatch`);
      return res
        .status(401)
        .json({ message: "Not authorised to update this booking" });
    }

    const { status, proposedDate, proposedTime, note } = req.body;
    booking.status = status || booking.status;

    if (status === "accepted") {
      booking.proposedDate = proposedDate || booking.date;
      booking.proposedTime = proposedTime || booking.time;
      booking.note = note || "";
    }

    const updated = await booking.save();
    console.log(`[BookingStatus] Updated successfully: ${updated._id} status=${updated.status}`);
    res.json(updated);
  } catch (error) {
    console.error(`[BookingStatus] ERROR:`, error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/bookings/:id/feedback — Submit feedback
router.post("/:id/feedback", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.consulteeId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorised to rate this session" });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({ message: "Can only rate completed sessions" });
    }

    if (booking.feedback && booking.feedback.rating) {
      return res.status(400).json({ message: "Feedback already submitted for this session" });
    }

    const { rating, comment } = req.body;
    
    // Update booking
    booking.feedback = {
      rating: Number(rating),
      comment,
      submittedAt: new Date()
    };
    await booking.save();

    // Update expert average rating
    const User = require("../models/User");
    const expert = await User.findById(booking.expertId);
    if (expert) {
      const newReviewCount = expert.reviewCount + 1;
      const newRating = ((expert.rating * expert.reviewCount) + Number(rating)) / newReviewCount;
      expert.rating = newRating;
      expert.reviewCount = newReviewCount;
      await expert.save();
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
