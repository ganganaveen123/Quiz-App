import React, { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate ,Link} from "react-router-dom";
import "./UserRegistration.css";

const UserRegistration = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           // console.log(Hello);
            await registerUser({ ...formData, role: "user", action: "register" });
            console.log({ ...formData, role: "user", action: "register" });

            alert("User Registered Successfully");
            navigate("/Userlogin"); // Redirect after successful registration
        } catch (error) {
            console.error("Registration failed", error);
        }
    };

    return (
        <div className="user-register-container">
            <div className ="user-registration-box">
            <h2>User Registration</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit" className="submit-btn">Register</button>
            </form>
            <p className="switch-auth">Already have an account? <Link to = "/Userlogin">Login</Link></p>
            </div>
        </div>
    );
};

export default UserRegistration;