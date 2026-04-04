const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const User = require("./models/User");
const { connectToWhatsApp } = require("./whatsappService");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
    try {
      const adminExists = await User.findOne({ email: "admin@consultify.com" });
      if (!adminExists) {
        await User.create({
          name: "System Admin",
          email: "admin@consultify.com",
          password: "admin123",
          role: "admin",
          gender: "Prefer not to say",
        });
        console.log("Admin account seeded (admin@consultify.com/admin123)");
      }
    } catch (error) {
      console.log("Admin Seeding Error:", error);
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
  // WhatsApp is optional — don't crash the server if it fails
  connectToWhatsApp().catch((err) =>
    console.error("[WhatsApp] Failed to start:", err.message)
  );
});
