const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, expertOnly } = require('../middleware/auth');

// @route   GET /api/users/experts
// @desc    Get all experts
router.get('/experts', async (req, res) => {
  try {
    const experts = await User.find({ role: 'expert' }).select('-password');
    res.json(experts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users/experts/:id
// @desc    Get single expert profile
router.get('/experts/:id', async (req, res) => {
  try {
    const expert = await User.findById(req.params.id).select('-password');
    if (expert && expert.role === 'expert') {
      res.json(expert);
    } else {
      res.status(404).json({ message: 'Expert not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile (Expert updating availability, bio, etc.)
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      if (req.body.profilePicture !== undefined) {
        user.profilePicture = req.body.profilePicture;
      }
      if (user.role === 'expert') {
        user.skills = req.body.skills || user.skills;
        user.bio = req.body.bio || user.bio;
        user.pricingPerSession = req.body.pricingPerSession !== undefined ? req.body.pricingPerSession : user.pricingPerSession;
        user.availabilitySlots = req.body.availabilitySlots || user.availabilitySlots;
      }
      
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        skills: updatedUser.skills,
        bio: updatedUser.bio,
        pricingPerSession: updatedUser.pricingPerSession,
        availabilitySlots: updatedUser.availabilitySlots,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
