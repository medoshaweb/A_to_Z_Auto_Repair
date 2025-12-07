const express = require("express");
const router = express.Router();
const authenticateCustomer = require("../middleware/customerAuth");
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  handleStripeWebhook,
} = require("../controllers/paymentsController");

// Stripe webhook (must use raw body)
// This route is registered before body parser in server.js
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// Create payment intent - PROTECTED
router.post("/:orderId/intent", authenticateCustomer, createPaymentIntent);

// Confirm payment - PROTECTED
router.post("/confirm", authenticateCustomer, confirmPayment);

// Get payment history for an order - PROTECTED
router.get("/:orderId/history", authenticateCustomer, getPaymentHistory);

module.exports = router;

