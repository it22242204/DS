const Cart = require("../Models/CartManagementModel");
const { JWT_SECRET } = require("../config/env");
const jwt = require("jsonwebtoken");

// Middleware to verify customer role
const verifyCustomer = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'customer') {
      return res.status(403).json({ message: "Access restricted to customers" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Get user's cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate('userId', 'name email role');
    
    if (!cart) return res.status(200).json({ items: [] });
    
    res.status(200).json({
      items: cart.items,
      restaurantId: cart.items[0]?.restaurantId || null
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add/Update item in cart
const updateCart = async (req, res) => {
  try {
    const { item, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        items: [{ ...item, quantity }]
      });
    } else {
      const existingItem = cart.items.find(i => i.id === item.id);
      const currentRestaurantId = cart.items[0]?.restaurantId;

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        if (currentRestaurantId && currentRestaurantId !== item.restaurantId) {
          return res.status(400).json({
            message: "Cart contains items from another restaurant",
            requiresConfirmation: true
          });
        }
        cart.items.push({ ...item, quantity });
      }
    }

    cart.updatedAt = Date.now();
    await cart.save();
    res.status(200).json(cart.items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Remove item from cart
const removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    
    cart.items = cart.items.filter(item => item.id !== itemId);
    cart.updatedAt = Date.now();
    await cart.save();
    
    res.status(200).json(cart.items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// Clear cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    
    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();
    
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update item quantity in cart
const updateItemQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!itemId || typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(i => i.id === itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json(cart.items);
  } catch (error) {
    console.error("Update item quantity error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  verifyCustomer,
  getCart,
  updateCart,
  removeItem,
  clearCart,
  updateItemQuantity
};
