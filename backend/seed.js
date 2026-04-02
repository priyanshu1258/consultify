const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/consultify';

const seedUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Remove existing test users if they exist
    await User.deleteMany({ email: { $in: ['test_consultee@test.com', 'test_expert@test.com'] } });

    const consultee = new User({
      name: 'Test Consultee',
      email: 'test_consultee@test.com',
      password: '123456',
      role: 'consultee'
    });

    const expert = new User({
      name: 'Test Expert',
      email: 'test_expert@test.com',
      password: '123456',
      role: 'expert',
      skills: ['React', 'Node.js', 'MongoDB'],
      bio: 'I am a test expert ready to help you.',
      pricingPerSession: 50,
      availabilitySlots: [{ day: 'Monday', startTime: '09:00', endTime: '17:00' }]
    });

    await consultee.save();
    await expert.save();

    console.log('Test users created successfully!');
    console.log('Consultee: test_consultee@test.com / 123456');
    console.log('Expert: test_expert@test.com / 123456');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
