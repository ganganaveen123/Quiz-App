import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import "./Userlogin.css";

const UserLogin = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
         setFormData({ ...formData, [e.target.name]: e.target.value });
        
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
              const response=  await loginUser({ ...formData, action: "login", role: "user" });
               console.log(response.data);
        //    // Store token and user in localStorage
             const { token, user } = response.data;
      
             if (token && user) {
            
            //    console.log("Token:", localStorage.getItem("token"));

               localStorage.setItem("token", token);
               localStorage.setItem("user", JSON.stringify(user));
               localStorage.setItem("userId",user.id);
               localStorage.setItem("username", user.name);
               
              alert("User Logged In Successfully");
              navigate("/UserDashboard");
             } else {
               alert("Login failed: Invalid response from server");
             }
        } catch (error) {
          console.error("Login failed", error);
          alert("Invalid email or password");
        }
      };

      
    return (
        <div className="user-login-container">
            <div className ="user-login-box">
            <h2>User Login</h2>

            <form onSubmit={handleSubmit}>

                <div className="input-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit" className="submitbtn">Login</button>
            </form>
            <p className="switchauth">
                Don't have an account? <Link to="/UserRegistration">Register</Link>
            </p>
            </div>
        </div>
    );
};

export default UserLogin;
