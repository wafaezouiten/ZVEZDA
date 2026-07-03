const mongoose = require('mongoose');

async function connexionDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ZvezdaDB');
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

module.exports = connexionDB;
