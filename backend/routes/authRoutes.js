const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });
let transporter;
const initializeTransporter = async () => {
  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: (process.env.EMAIL_USER || '').trim(),
          pass: (process.env.EMAIL_PASS || '').trim()
        }
      });
      // Verify Gmail transport
      await transporter.verify();
      console.log('Nodemailer Gmail account ready with real email service 🚀');
    } else {
      throw new Error('Gmail credentials missing');
    }
  } catch (err) {
    console.warn('Gmail transport failed, falling back to Ethereal:', err.message);
    // Use Ethereal for testing
    let account = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: { user: account.user, pass: account.pass }
    });
    console.log('Nodemailer Ethereal account ready (Testing Mode)');
  }
};
initializeTransporter();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

// @route   POST /api/auth/send-otp
// @desc    Send OTP to email
router.post('/send-otp', async (req, res) => {
  try {
    // Ensure transporter is ready (initialize or fallback)
    await initializeTransporter();
    const { email } = req.body;
    let userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    if (!transporter) return res.status(500).json({ message: 'Email service failed to initialize' });

    // simple 6 digit otp
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[GENERATED OTP] Email: ${email} | OTP: ${otpCode}`);
    
    await Otp.deleteMany({ email }); // keep only latest
    await Otp.create({ email, otp: otpCode });

    // Send actual email via Ethereal or Gmail
    let info = await transporter.sendMail({
      from: `"Consultify Registration" <${process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : 'no-reply@consultify.app'}>`,
      to: email,
      subject: "Your Consultify Verification Code",
      text: `Your OTP verification code is: ${otpCode}`,
      html: `<div style="font-family: sans-serif; padding: 20px;">
               <h2>Welcome to Consultify!</h2>
               <p>Your OTP verification code is:</p>
               <h1 style="color: #A855F7;">${otpCode}</h1>
             </div>`
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[EMAIL SENT VIA ETHEREAL] Preview URL: ${previewUrl}`);
    } else {
      console.log(`[REAL EMAIL SENT TO] ${email} successfully!`);
    }

    res.json({ message: 'OTP sent successfully', previewUrl: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user (consultee or expert)
router.post('/register', upload.array('expertDocuments', 5), async (req, res) => {
  try {
    const { firstName, lastName, mobile, email, password, role, gender, profilePicture, bio, pricingPerSession, otp } = req.body;
    let { skills, expertDocuments } = req.body;
    
    if (!otp) return res.status(400).json({ message: 'OTP is required' });

    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) return res.status(400).json({ message: 'Invalid or expired OTP' });

    let userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const name = `${firstName} ${lastName}`.trim();
    
    let parsedSkills = [];
    if (skills) {
      if (typeof skills === 'string') {
        parsedSkills = skills.split(',').map(s => s.trim());
      } else if (Array.isArray(skills)) {
        parsedSkills = skills;
      }
    }

    let docsToSave = [];
    if (req.files && req.files.length > 0) {
      docsToSave = req.files.map(file => ({
        name: file.originalname,
        type: file.mimetype,
        data: `/uploads/${file.filename}`
      }));
    } else if (expertDocuments) {
      if (typeof expertDocuments === 'string') {
        try { docsToSave = JSON.parse(expertDocuments); } catch(e) {}
      } else {
        docsToSave = expertDocuments;
      }
    }

    const user = await User.create({ 
      name, email, mobile, password, role: role || 'consultee',
      gender, profilePicture: profilePicture === 'null' ? null : (profilePicture || null),
      bio, pricingPerSession, skills: parsedSkills,
      expertDocuments: docsToSave
    });
    
    // remove the otp after successful registration
    await Otp.deleteMany({ email });
    
    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        profilePicture: user.profilePicture,
        bio: user.bio,
        pricingPerSession: user.pricingPerSession,
        skills: user.skills,
        expertDocuments: user.expertDocuments,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Auth user & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        pricingPerSession: user.pricingPerSession,
        skills: user.skills,
        profilePicture: user.profilePicture,
        availabilitySlots: user.availabilitySlots,
        expertDocuments: user.expertDocuments,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
