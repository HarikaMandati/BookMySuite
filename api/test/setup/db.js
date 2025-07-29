const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.TEST_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Test database connected');
  } catch (err) {
    console.error('Test database connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;