const mongoose = require( "mongoose");

const earningsSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  week: {
    type: Number,
    required: true,
    default: 0,
  },
  month: {
    type: Number,
    required: true,
    default: 0,
  },
  year: {
    type: Number,
    required: true,
    default: 0,
  },
  records: [
    {
      id: { type: String, required: true },
      date: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Earnings", earningsSchema);
