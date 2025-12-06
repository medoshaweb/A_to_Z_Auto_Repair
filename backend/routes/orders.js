const express = require("express");
const router = express.Router();
const authenticateCustomer = require("../middleware/customerAuth");
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  addServiceToOrder,
} = require("../controllers/ordersController");

// Get all orders with customer and vehicle info
router.get("/", getAllOrders);

// Get single order by ID
router.get("/:id", getOrderById);

// Create new order - NOW PROTECTED
router.post("/", authenticateCustomer, createOrder);

// Update order
router.put("/:id", updateOrder);

// Add service to order - NOW PROTECTED
router.post("/:id/services", authenticateCustomer, addServiceToOrder);

module.exports = router;
