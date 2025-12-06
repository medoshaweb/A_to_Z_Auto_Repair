const express = require("express");
const router = express.Router();
const authenticateCustomer = require("../middleware/customerAuth");
const {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  getCustomerVehicles,
  createCustomerVehicle,
  getCustomerOrders,
} = require("../controllers/customersController");

// Get all customers with search and pagination
router.get("/", getAllCustomers);

// Get single customer by ID
router.get("/:id", getCustomerById);

// Create new customer
router.post("/", createCustomer);

// Update customer
router.put("/:id", updateCustomer);

// Get customer vehicles - PROTECTED for customers
router.get("/:id/vehicles", authenticateCustomer, getCustomerVehicles);

// Create new vehicle for customer - PROTECTED
router.post("/:id/vehicles", authenticateCustomer, createCustomerVehicle);

// Get customer orders - PROTECTED
router.get("/:id/orders", authenticateCustomer, getCustomerOrders);

module.exports = router;
