import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css"; // Reuse styles

const CustomerLoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      const response = await axios.post(
        "http://localhost:5000/api/customer-auth/login",
        formData
      );

      // Store customer token and info separately from admin
      localStorage.setItem("customerToken", response.data.token);
      localStorage.setItem("customer", JSON.stringify(response.data.customer));

      alert("Login successful!");

      // Reset form
      setFormData({ email: "", password: "" });

      // Redirect to customer dashboard
      navigate("/customer/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Your Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div style={{ textAlign: "right", marginBottom: "15px" }}>
          <Link
            to="/customer/forgot-password"
            style={{
              fontSize: "14px",
              color: "#dc143c",
              textDecoration: "none",
            }}
          >
            Forgot Password?
          </Link>
          <span style={{ margin: "0 10px", color: "#ccc" }}>|</span>
          <Link
            to="/customer/forgot-username"
            style={{
              fontSize: "14px",
              color: "#dc143c",
              textDecoration: "none",
            }}
          >
            Forgot Username?
          </Link>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "LOGGING IN..." : "LOGIN"}
        </button>
      </form>
    </div>
  );
};

export default CustomerLoginForm;
