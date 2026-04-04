require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Otp = require('./models/Otp');

async function testDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully! ✅");

    const users = await User.find({}).select('-password').limit(5);
    const otps = await Otp.find({}).limit(5);

    console.log("\n--- Users in Database ---");
    if (users.length > 0) {
      console.log(`Found ${users.length} users. Here are the latest:\n`, users);
    } else {
      console.log("No users found in the database. Data might not be storing or no one registered yet.");
    }

    console.log("\n--- OTPs in Database ---");
    if (otps.length > 0) {
      console.log(`Found ${otps.length} OTP records:\n`, otps);
    } else {
      console.log("No OTP records found.");
    }

    mongoose.disconnect();
  } catch (error) {
    console.error("Database connection failed ❌:", error);
  }
}

testDb();
