const Earnings = require ( "../models/Earnings.js");
const { isSameWeek, isSameMonth, isSameYear } = require('date-fns');

// GET Earnings for a specific driver
exports.getDriverEarnings = async (req, res) => {
    try {
      const driverId = req.params.driverId;
  
      const earnings = await Earnings.findOne({ driverId });
  
      if (!earnings) {
        return res.status(404).json({ message: "Earnings not found" });
      }
  
      const now = new Date();
  
      const weekEarnings = earnings.records
        .filter(record => isSameWeek(new Date(record.date), now, { weekStartsOn: 1 }))
        .reduce((sum, record) => sum + record.amount, 0);
  
      const monthEarnings = earnings.records
        .filter(record => isSameMonth(new Date(record.date), now))
        .reduce((sum, record) => sum + record.amount, 0);
  
      const yearEarnings = earnings.records
        .filter(record => isSameYear(new Date(record.date), now))
        .reduce((sum, record) => sum + record.amount, 0);
  
      res.status(200).json({
        week: weekEarnings,
        month: monthEarnings,
        year: yearEarnings,
        records: earnings.records,
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch earnings" });
    }
  };

// POST create Earnings (you might want an admin to create this)
exports.createEarnings = async (req, res) => {
  try {
    const { driverId, week, month, year, records } = req.body;
    
    const newEarnings = new Earnings({ driverId, week, month, year, records });
    await newEarnings.save();

    res.status(201).json(newEarnings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
