const mongoose = require("mongoose");
const { MONGO_URI } = require("./env");

const connectDB = async () => {
  if (!MONGO_URI) {
    console.error("❌ MONGO_URI is not defined. Please check your environment variables.");
    process.exit(1);
  }

  try {

    mongoose.set("bufferCommands", false); 

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🚀 Connected to MongoDB (Delivery Service)");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
};

module.exports = connectDB;
