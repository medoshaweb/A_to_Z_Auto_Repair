import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./AddVehicle.css";

const CustomerAddVehicle = () => {
  const navigate = useNavigate();
  const customer = JSON.parse(localStorage.getItem("customer") || "null");
  const token = localStorage.getItem("customerToken");

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    vehicle_type: "",
    vin: "",
    license_plate: "",
    color: "",
    mileage: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.make || !formData.model) {
      setError("Make and model are required");
      setLoading(false);
      return;
    }

    if (!customer || !token) {
      navigate("/customer/login");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/customers/${customer.id}/vehicles`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Vehicle added successfully!");
      navigate("/customer/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add vehicle. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-vehicle-page">
      <Header />
      <main className="main-content">
        <div className="customer-container">
          <h1 className="page-title">
            Add a new vehicle
            <span className="title-underline"></span>
          </h1>

          <div className="form-container">
            <form onSubmit={handleSubmit}>
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <input
                  type="number"
                  name="year"
                  placeholder="Vehicle year"
                  value={formData.year}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="make"
                  placeholder="Vehicle make"
                  value={formData.make}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="model"
                  placeholder="Vehicle model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Vehicle type</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Truck">Truck</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Van">Van</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <input
                  type="number"
                  name="mileage"
                  placeholder="Vehicle mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  min="0"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="license_plate"
                  placeholder="Vehicle tag"
                  value={formData.license_plate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="vin"
                  placeholder="Vehicle serial"
                  value={formData.vin}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="color"
                  placeholder="Vehicle color"
                  value={formData.color}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => navigate("/customer/dashboard")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? "ADDING..." : "ADD VEHICLE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerAddVehicle;
