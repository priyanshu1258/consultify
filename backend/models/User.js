const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['consultee', 'expert', 'admin'], default: 'consultee' },
  gender: { type: String, enum: ['Male', 'Female', 'Non-binary', 'Prefer not to say'] },
  profilePicture: { type: String, default: null }, // base64 data URL
  
  // Expert specific fields
  skills: [{ type: String }],
  bio: { type: String },
  pricingPerSession: { type: Number, default: 0 },
  availabilitySlots: [{
    day: { type: String },
    startTime: { type: String },
    endTime: { type: String }
  }],
  expertDocuments: [{
    name: { type: String },
    type: { type: String }, // 'application/pdf' or image MIME
    data: { type: String }  // base64 data URL
  }],
  documentsVerified: { type: Boolean, default: false }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
