const mongoose = require('mongoose');

const connectDB = async () => {
  let uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense_tracker';

  // Automatically append SSL parameter for Atlas clusters if omitted
  if (uri.includes('.mongodb.net') && !uri.includes('ssl=')) {
    const separator = uri.includes('?') ? '&' : '?';
    uri = `${uri}${separator}ssl=true&authSource=admin`;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Primary MongoDB Connection Error: ${error.message}`);
    console.log('Attempting fallback to local MongoDB instance (mongodb://127.0.0.1:27017/expense_tracker)...');
    try {
      const fallbackConn = await mongoose.connect('mongodb://127.0.0.1:27017/expense_tracker', {
        serverSelectionTimeoutMS: 5000
      });
      console.log(`MongoDB Fallback Connected: ${fallbackConn.connection.host}`);
    } catch (fallbackError) {
      console.error(`MongoDB Connection Failed completely: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
