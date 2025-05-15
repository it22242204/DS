const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5600;
const DEV_MODE = process.env.DEV_MODE || "development";
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

module.exports = {
  PORT,
  DEV_MODE,
  BASE_URL,
  MONGO_URI,
  JWT_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
};