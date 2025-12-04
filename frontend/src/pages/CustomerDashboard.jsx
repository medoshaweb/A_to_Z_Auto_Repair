import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./CustomerDashboard.css";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      const token = localStorage.getItem("customerToken");
      const customerData = JSON.parse(
        localStorage.getItem("customer") || "null"
      );

      if (!token || !customerData) {
        navigate("/customer/login");
        return;
      }

      setCustomer(customerData);

      // Fetch vehicles and orders
      const [vehiclesRes, ordersRes] = await Promise.all([
        axios.get(
          `http://localhost:5000/api/customers/${customerData.id}/vehicles`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get(
          `http://localhost:5000/api/customers/${customerData.id}/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
      ]);

      setVehicles(vehiclesRes.data.vehicles);
      setOrders(ordersRes.data.orders);
    } catch (error) {
      console.error("Error fetching customer data:", error);
      if (error.response?.status === 401) {
        navigate("/customer/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customer");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="customer-dashboard-page">
        <Header />
        <main className="main-content">
          <div className="loading">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="customer-dashboard-page">
      <Header />
      <main className="main-content">
        <div className="customer-container">
          <div className="customer-header">
            <h1>
              Welcome, {customer?.first_name} {customer?.last_name}
            </h1>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div className="customer-sections">
            {/* Vehicles Section */}
            <section className="customer-section">
              <div className="section-header-with-button">
                <h2>My Vehicles</h2>
                <button
                  className="add-btn"
                  onClick={() => navigate("/customer/vehicles/add")}
                >
                  + Add Vehicle
                </button>
              </div>
              {vehicles.length === 0 ? (
                <p className="empty-message">No vehicles registered yet.</p>
              ) : (
                <div className="vehicles-grid">
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="vehicle-card">
                      <h3>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      <p>
                        <strong>VIN:</strong> {vehicle.vin || "N/A"}
                      </p>
                      <p>
                        <strong>License:</strong>{" "}
                        {vehicle.license_plate || "N/A"}
                      </p>
                      <p>
                        <strong>Color:</strong> {vehicle.color || "N/A"}
                      </p>
                      {vehicle.mileage && (
                        <p>
                          <strong>Mileage:</strong>{" "}
                          {vehicle.mileage.toLocaleString()} miles
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Orders Section */}
            <section className="customer-section">
              <div className="section-header-with-button">
                <h2>My Service Orders</h2>
                <button
                  className="add-btn"
                  onClick={() => navigate("/customer/orders/new")}
                >
                  + Request Service
                </button>
              </div>
              {orders.length === 0 ? (
                <p className="empty-message">No service orders yet.</p>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <h3>Order #{order.id}</h3>
                        <span
                          className={`status-badge status-${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      {order.make && order.model && (
                        <p>
                          <strong>Vehicle:</strong> {order.year} {order.make}{" "}
                          {order.model}
                        </p>
                      )}
                      <p>
                        <strong>Total:</strong> ${order.total_amount || "0.00"}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                      {order.description && (
                        <p>
                          <strong>Description:</strong> {order.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerDashboard;
