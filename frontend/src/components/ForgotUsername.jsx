import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginForm.css";

const ForgotUsername = ({ userType = "admin" }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint =
        userType === "admin"
          ? "/api/auth/forgot-username"
          : "/api/customer-auth/forgot-username";

      const response = await axios.post(`http://localhost:5000${endpoint}`, {
        email,
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to retrieve username");
    } finally {
      setLoading(false);
    }
  };

  if (result?.email) {
    return (
      <div className="login-container">
        <div className="login-form-wrapper">
          <h1 className="login-title">
            Username Recovery
            <span className="title-underline"></span>
          </h1>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <p style={{ marginBottom: "10px", color: "#666" }}>
              {result.message}
            </p>
            <div
              style={{
                padding: "15px",
                backgroundColor: "#e3f2fd",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: "bold",
                color: "#1e3a8a",
              }}
            >
              {result.email}
            </div>
            {result.firstName && (
              <p style={{ marginTop: "10px", color: "#666" }}>
                Hello, {result.firstName}!
              </p>
            )}
          </div>
          <button
            className="login-button"
            onClick={() =>
              navigate(
                userType === "admin" ? "/admin/login" : "/customer/login"
              )
            }
          >
            GO TO LOGIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h1 className="login-title">
          Forgot Username
          <span className="title-underline"></span>
        </h1>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          {result && !result.email && (
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: "#666",
              }}
            >
              {result.message}
            </div>
          )}
          <p
            style={{ textAlign: "center", marginBottom: "20px", color: "#666" }}
          >
            Enter your email address to retrieve your username.
          </p>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "SEARCHING..." : "RETRIEVE USERNAME"}
          </button>
          <button
            type="button"
            className="link-button"
            onClick={() =>
              navigate(
                userType === "admin" ? "/admin/login" : "/customer/login"
              )
            }
            style={{ marginTop: "10px" }}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotUsername;
