const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Set up MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/consultify';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
