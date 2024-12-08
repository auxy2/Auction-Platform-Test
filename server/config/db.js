// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {

  console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  }
};


module.exports = connectDB;
