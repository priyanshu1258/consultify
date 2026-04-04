const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');
const { waState } = require('../whatsappService');

// Make all routes below protected matching adminOnly
router.use(protect);
router.use(adminOnly);

// @route   GET /api/admin/users
// @desc    Get all users (consultees and experts)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }).select('-password -expertDocuments.data').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete admin user' });
        }
        await User.findByIdAndDelete(req.params.id);
        
        // Also delete their bookings if needed, or leave as historical data.
        await Booking.deleteMany({ $or: [{ consulteeId: req.params.id }, { expertId: req.params.id }] });

        res.json({ message: 'User removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const totalConsultees = await User.countDocuments({ role: 'consultee' });
        const totalExperts = await User.countDocuments({ role: 'expert' });
        const totalBookings = await Booking.countDocuments({});
        
        res.json({
            totalConsultees,
            totalExperts,
            totalBookings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/admin/whatsapp/status
// @desc    Returns current WhatsApp connection status
router.get('/whatsapp/status', (req, res) => {
    res.json({ status: waState.status });
});

// @route   GET /api/admin/whatsapp/qr
// @desc    Returns the current QR code as a base64 data URL (if pending)
router.get('/whatsapp/qr', (req, res) => {
    if (waState.status === 'connected') {
        return res.json({ status: 'connected', qr: null });
    }
    if (waState.status === 'qr_ready' && waState.qrDataUrl) {
        return res.json({ status: 'qr_ready', qr: waState.qrDataUrl });
    }
    res.json({ status: waState.status, qr: null });
});

module.exports = router;
