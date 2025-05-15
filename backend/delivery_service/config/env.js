const dotenv =require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 2025;
const BASE_URL = process.env.BASE_URL || "http://localhost:5200";
const MONGO_URI = process.env.MONGO_URI;


module.exports = { PORT, BASE_URL, MONGO_URI };