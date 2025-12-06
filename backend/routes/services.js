const express = require("express");
const router = express.Router();
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/servicesController");

// Get all services
router.get("/", getAllServices);

// Get single service by ID
router.get("/:id", getServiceById);

// Create new service
router.post("/", createService);

// Update service
router.put("/:id", updateService);

// Delete service
router.delete("/:id", deleteService);

module.exports = router;
