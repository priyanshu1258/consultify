const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

async function test() {
  try {
    // 1. Send OTP
    console.log("Sending OTP...");
    let res = await axios.post("http://localhost:5000/api/auth/send-otp", {
      identifier: "+919999999999",
      channel: "whatsapp"
    });
    console.log(res.data);
    
    // We need the OTP from the MongoDB
    const mongoose = require('mongoose');
    require('dotenv').config();
    await mongoose.connect(process.env.MONGO_URI); // Ensure this matches MONGO_URI
    const Otp = mongoose.connection.collection('otps');
    const otpDoc = await Otp.findOne({ identifier: "+919999999999" });
    if (!otpDoc) {
      console.error("No OTP found in DB for the identifier!");
      process.exit(1);
    }
    const otpCode = otpDoc.otp;
    console.log("Found OTP in DB:", otpCode);

    // 2. Prepare Form Data
    console.log("Preparing Multer Form Data...");
    const form = new FormData();
    form.append('firstName', 'TestMulter');
    form.append('lastName', 'User');
    form.append('mobile', '+919999999999');
    form.append('email', `testmulter${Date.now()}@example.com`);
    form.append('password', 'password123');
    form.append('role', 'expert');
    form.append('gender', 'Male');
    form.append('otp', otpCode);
    form.append('bio', 'I am testing multer file upload');
    form.append('pricingPerSession', 500);
    form.append('skills', JSON.stringify(["Test", "Multer"]));

    // Create 60kb files
    const p1 = path.join(__dirname, 'profile.jpg');
    const p2 = path.join(__dirname, 'doc.pdf');
    fs.writeFileSync(p1, Buffer.alloc(60000, 'a'));
    fs.writeFileSync(p2, Buffer.alloc(60000, 'b'));

    form.append('profilePicture', fs.createReadStream(p1));
    form.append('expertDocuments', fs.createReadStream(p2));

    // 3. Register
    console.log("Registering user via Multipart/FormData...");
    const regRes = await axios.post("http://localhost:5000/api/auth/register", form, {
      headers: {
        ...form.getHeaders()
      }
    });

    console.log("Success! Response from backend:", regRes.data);
    fs.unlinkSync(p1);
    fs.unlinkSync(p2);
    
    // Check if files actually exist in backend/uploads
    console.log("Verifying files in /uploads folder...");
    // The profilePicture should be a URL like: http://localhost:5000/uploads/123123-profile.jpg
    const filename = regRes.data.profilePicture.split("/uploads/")[1];
    if (fs.existsSync(path.join(__dirname, '../../../../OneDrive/Desktop/consultify/backend/uploads', filename))) {
        console.log("File correctly written to backend/uploads!!");
    } else {
        console.error("File NOT found in uploads directory!");
    }
    
    process.exit(0);
  } catch (e) {
    console.error("Error during test:");
    if (e.response) {
      console.error(e.response.data);
    } else {
      console.error(e);
    }
    process.exit(1);
  }
}
test();
