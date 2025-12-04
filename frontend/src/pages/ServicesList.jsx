import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./ServicesList.css";

const ServicesList = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/services");
      setServices(response.data.services);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

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
    setSubmitting(true);

    if (!formData.name.trim()) {
      setError("Service name is required");
      setSubmitting(false);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/services", formData);
      alert("Service added successfully!");
      setFormData({ name: "", description: "" });
      fetchServices();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add service. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`);
      alert("Service deleted successfully!");
      fetchServices();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete service");
    }
  };

  const handleEdit = (service) => {
    // Navigate to edit page or open edit modal
    // For now, just show alert - you can create an EditService page later
    alert(`Edit functionality for ${service.name} - To be implemented`);
  };

  return (
    <div className="services-list-page">
      <Header />
      <div className="page-content">
        <AdminSidebar />
        <main className="main-admin-content">
          <h1 className="page-title">
            Services we provide
            <span className="title-underline"></span>
          </h1>

          <div className="services-content">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <>
                <div className="services-list">
                  {services.length === 0 ? (
                    <p className="empty-message">No services found</p>
                  ) : (
                    services.map((service) => (
                      <div key={service.id} className="service-item">
                        <div className="service-content">
                          <h3>{service.name}</h3>
                          {service.description && <p>{service.description}</p>}
                        </div>
                        <div className="service-actions">
                          <button
                            onClick={() => handleEdit(service)}
                            className="edit-btn"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="delete-btn"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="add-service-section">
                  <h2 className="section-title">
                    Add a new service
                    <span className="title-underline"></span>
                  </h2>
                  <form onSubmit={handleSubmit} className="add-service-form">
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-group">
                      <input
                        type="text"
                        name="name"
                        placeholder="Service name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <textarea
                        name="description"
                        placeholder="Service description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-textarea"
                        rows="4"
                      />
                    </div>
                    <button
                      type="submit"
                      className="submit-button"
                      disabled={submitting}
                    >
                      {submitting ? "ADDING..." : "ADD SERVICE"}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ServicesList;
