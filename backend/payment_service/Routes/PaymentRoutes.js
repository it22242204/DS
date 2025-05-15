require("dotenv").config();
const express = require("express");
const router3 = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create Checkout Session
router3.post("/create-checkout-session", async (req, res) => {
  try {
    const { items, deliveryFee } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid or missing products array" });
    }

    // Use the correct variable and fields!
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "lkr", // <-- use the same currency for all line items
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    // Add delivery fee as a separate line item (same currency!)
    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: "lkr", // <-- match currency above
          product_data: {
            name: "Delivery Fee",
          },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:8080/payment-success",
      cancel_url: "http://localhost:8080/payment-cancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe session creation error:", error.message);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
});


module.exports = router3;
