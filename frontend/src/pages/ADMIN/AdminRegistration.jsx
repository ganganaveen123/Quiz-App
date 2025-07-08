import React, { useState } from "react";
import { registerUser } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./AdminRegistration.css";

const AdminRegistration = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ ...formData, action: "register", role: "admin" });
      alert("Admin Registered Successfully");

      // Redirect to admin login page
      navigate("/AdminLogin");

    } catch (error) {
      const backendMessage = error.response?.data?.message || "Registration failed";
      console.error("Registration failed:", backendMessage);
      alert(backendMessage);
    }
  };

  return (
    <div className="admin-register-container">
      <div className="admin-register-box">
      <h2>Admin Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">Register</button>
      </form>

      <p className="switch-auth">
        Already have an account? <Link to="/AdminLogin">Login</Link>
      </p>
    </div>
    </div>
  );
};

export default AdminRegistration;
