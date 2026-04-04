const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Otp = require("../models/Otp");
const jwt = require("jsonwebtoken");
const { sendWhatsAppMessage } = require("../whatsappService");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "30d",
  });
};

// @route   POST /api/auth/send-otp
// @desc    Send OTP to whatsapp
router.post("/send-otp", async (req, res) => {
  try {
    const { identifier, channel } = req.body; // identifier is mobile string
    if (!identifier)
      return res.status(400).json({ message: "Identifier (mobile) required" });

    // simple 6 digit otp
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(
      `[GENERATED OTP] Channel: whatsapp | ID: ${identifier} | OTP: ${otpCode}`,
    );

    await Otp.deleteMany({ identifier });
    await Otp.create({ identifier, otp: otpCode });

    // Always send via WhatsApp
    try {
      await sendWhatsAppMessage(
        identifier,
        `Welcome to Consultify!\nYour verification code is: *${otpCode}*`,
      );
      return res.json({ message: "OTP sent successfully via WhatsApp" });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({
          message:
            "Failed to send WhatsApp message. Ensure Baileys is connected.",
        });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user (consultee or expert)
router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      mobile,
      email,
      password,
      role,
      gender,
      profilePicture,
      bio,
      pricingPerSession,
      skills,
      expertDocuments,
      otp,
    } = req.body;

    if (!otp) return res.status(400).json({ message: "OTP is required" });

    // Identify by mobile for OTP
    const identifier = mobile;
    const validOtp = await Otp.findOne({ identifier, otp });

    if (!validOtp)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    let userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email is already registered" });

    if (mobile) {
      let mobileExists = await User.findOne({ mobile });
      if (mobileExists)
        return res
          .status(400)
          .json({ message: "Mobile number is already registered" });
    }

    const name = `${firstName} ${lastName}`.trim();

    const user = await User.create({
      name,
      email,
      mobile,
      password,
      role: role || "consultee",
      gender,
      profilePicture: profilePicture || null,
      bio,
      pricingPerSession,
      skills,
      expertDocuments: expertDocuments || [],
    });

    await Otp.deleteMany({ identifier });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        gender: user.gender,
        profilePicture: user.profilePicture,
        bio: user.bio,
        pricingPerSession: user.pricingPerSession,
        skills: user.skills,
        expertDocuments: user.expertDocuments,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Auth user & get token (Password Login)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        bio: user.bio,
        pricingPerSession: user.pricingPerSession,
        skills: user.skills,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login-otp
// @desc    Auth user via OTP
router.post("/login-otp", async (req, res) => {
  try {
    const { identifier, otp } = req.body; // mobile or email

    if (!identifier || !otp)
      return res.status(400).json({ message: "Identifier and OTP required" });

    const validOtp = await Otp.findOne({ identifier, otp });
    if (!validOtp)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    // find user by mobile or email
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });

    if (user) {
      await Otp.deleteMany({ identifier });
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        bio: user.bio,
        pricingPerSession: user.pricingPerSession,
        skills: user.skills,
        token: generateToken(user._id),
      });
    } else {
      res.status(404).json({ message: "User not found in system" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
