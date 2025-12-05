import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./LoginForm.css";

const ForgotPassword = ({ userType = "admin" }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: request, 2: reset, 3: success
  const [formData, setFormData] = useState({
    email: "",
    token: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint =
        userType === "admin"
          ? "/api/auth/forgot-password"
          : "/api/customer-auth/forgot-password";

      const response = await axios.post(`http://localhost:5000${endpoint}`, {
        email: formData.email,
      });

      if (response.data.resetToken) {
        setResetToken(response.data.resetToken);
        setStep(2);
        alert(
          `Reset token: ${response.data.resetToken}\n\nIn production, this would be sent via email.`
        );
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to request password reset"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        userType === "admin"
          ? "/api/auth/reset-password"
          : "/api/customer-auth/reset-password";

      await axios.post(`http://localhost:5000${endpoint}`, {
        token: formData.token || resetToken,
        newPassword: formData.newPassword,
      });

      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="login-container">
        <div className="login-form-wrapper">
          <h1 className="login-title">
            Password Reset Successful
            <span className="title-underline"></span>
          </h1>
          <p style={{ textAlign: "center", marginBottom: "20px" }}>
            Your password has been reset successfully. You can now login with
            your new password.
          </p>
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
          {step === 1 ? "Forgot Password" : "Reset Password"}
          <span className="title-underline"></span>
        </h1>

        {step === 1 ? (
          <form onSubmit={handleRequestReset} className="login-form">
            {error && <div className="error-message">{error}</div>}
            <p
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: "#666",
              }}
            >
              Enter your email address and we'll send you a password reset
              token.
            </p>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "SENDING..." : "SEND RESET TOKEN"}
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
        ) : (
          <form onSubmit={handleResetPassword} className="login-form">
            {error && <div className="error-message">{error}</div>}
            <p
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: "#666",
              }}
            >
              Enter the reset token and your new password.
            </p>
            {resetToken && (
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#e3f2fd",
                  borderRadius: "4px",
                  marginBottom: "15px",
                  fontSize: "12px",
                }}
              >
                <strong>Your reset token:</strong> {resetToken}
              </div>
            )}
            <div className="form-group">
              <input
                type="text"
                name="token"
                placeholder="Reset Token"
                value={formData.token || resetToken}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group password-input-wrapper">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="form-group password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "RESETTING..." : "RESET PASSWORD"}
            </button>
            <button
              type="button"
              className="link-button"
              onClick={() => setStep(1)}
              style={{ marginTop: "10px" }}
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
