const express=require("express");
// const mongoose=require("mongoose");
// const connectDB=require("./database/config.js");
const dotenv=require("dotenv");
const cors=require("cors");
const app=express();

const stripeRoutes = require('./Routes/PaymentRoutes.js');

dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/api/payments", stripeRoutes);

const PORT = process.env.PORT || 5400;

// console.log("Stripe secret:", process.env.STRIPE_SECRET);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});