const mongoose = require('mongoose');
require('dotenv').config(); // Ensure .env variables are loaded

const connectDB = async () => {
  try {
    // Set strictQuery to false to prepare for Mongoose 7 behavior
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, // No longer needed in Mongoose 6+
      // useFindAndModify: false, // No longer needed in Mongoose 6+
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;