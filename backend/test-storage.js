require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Otp = require('./models/Otp');

async function runStorageTest() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("1. Connected to MongoDB ✅");

    const email = `testuser_${Date.now()}@example.com`;

    // Manually create an OTP in the database
    const otpCode = '123456';
    await Otp.create({ email, otp: otpCode });
    console.log(`2. Successfully created OTP record for ${email} ✅`);

    // Use fetch to hit the backend server API for registration
    console.log("3. Calling the /api/auth/register API to store the User...");
    const payload = {
      firstName: 'Test',
      lastName: 'Store',
      mobile: '1234567890',
      email: email,
      password: 'password123',
      role: 'consultee',
      gender: 'Male',
      otp: otpCode
    };

    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (res.ok) {
      const data = await res.json();
      console.log("   Registration API Response:", data.email ? "Success" : "Failed");
      
      // Let's verify via Database directly
      const savedUser = await User.findOne({ email });
      if (savedUser) {
        console.log(`4. Verified! User ${savedUser.name} is successfully stored in the Database ✅`);
      } else {
        console.log("4. Failed to find user in database ❌");
      }
    } else {
      const errText = await res.text();
      console.log("   Registration failed:", res.status, errText);
    }
    
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    mongoose.disconnect();
  }
}

runStorageTest();
