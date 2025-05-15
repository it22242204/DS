const mongoose = require('mongoose');

const openingHoursSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  open: {
    type: String,
    required: true
  },
  close: {
    type: String,
    required: true
  },
  isClosed: {
    type: Boolean,
    default: false
  }
});

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  cuisine: {
    type: [String],
    required: true
  },
  images: {
    banner: { type: String },
    logo: { type: String, required: true },
    gallery: [String]
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  openingHours: [openingHoursSchema],
  isAvailable: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
}, { timestamps: true });

restaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
