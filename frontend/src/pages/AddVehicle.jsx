import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./AddVehicle.css";

const AddVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
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

    try {
      await axios.post(
        `http://localhost:5000/api/customers/${id}/vehicles`,
        formData
      );
      alert("Vehicle added successfully!");
      navigate(`/admin/customers/${id}`);
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
      <div className="page-content">
        <AdminSidebar />
        <main className="main-admin-content">
          <h1 className="page-title">
            Add a new vehicle
            <span className="title-underline"></span>
          </h1>

          <div className="form-container">
            <form onSubmit={handleSubmit}>
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <input
                  type="text"
                  name="make"
                  placeholder="Make (e.g., Toyota)"
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
                  placeholder="Model (e.g., Camry)"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  name="year"
                  placeholder="Year (e.g., 2020)"
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
                  name="vin"
                  placeholder="VIN (Vehicle Identification Number)"
                  value={formData.vin}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="license_plate"
                  placeholder="License Plate"
                  value={formData.license_plate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="color"
                  placeholder="Color"
                  value={formData.color}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  name="mileage"
                  placeholder="Mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  min="0"
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? "ADDING..." : "ADD VEHICLE"}
              </button>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AddVehicle;
