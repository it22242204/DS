const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    mongoose.set('bufferCommands', false);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit the process if connection fails
  }

  // Optional: Log connection errors
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
};

module.exports = connectDB;
