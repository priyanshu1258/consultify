const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Set up MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/consultify";

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 30000, // Increased from default 10s
    socketTimeoutMS: 45000, // Socket timeout
    maxPoolSize: 10, // Connection pooling
    minPoolSize: 2,
    retryWrites: true,
    retryReads: true,
  })
  .then(async () => {
    console.log("MongoDB Connected");
    // Seed Admin User
    const User = require('./models/User');
    const adminExists = await User.findOne({ email: 'admin@consultify.com' });
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@consultify.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('Admin user seeded: admin@consultify.com (password123)');
    }
  })
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
