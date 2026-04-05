const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    consulteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: String, required: true }, // requested date by consultee
    time: { type: String, required: true }, // requested time by consultee
    transactionId: { type: String, default: null }, // UTI / Transaction ID
    status: {
      type: String,
      enum: ["pending_admin", "pending", "accepted", "rejected", "completed"],
      default: "pending_admin",
    },
    meetingLink: { type: String }, // unique room ID
    // Expert proposed slot (sent back to consultee on accept)
    proposedDate: { type: String, default: null },
    proposedTime: { type: String, default: null },
    note: { type: String, default: "" }, // optional expert message
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      submittedAt: { type: Date }
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
