const mongoose = require('mongoose');

const customizationOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  options: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  required: {
    type: Boolean,
    default: false
  }
});

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  customizationOptions: [customizationOptionSchema],
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,  // in minutes
    default: 15
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  spiceLevel: {
    type: String,
    enum: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
    default: 'Medium'
  },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
