import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="glass-card">
        <h1 style={{ color: "black" }}>Welcome to the Quiz Portal</h1>
        <p>Challenge yourself with exciting quizzes and track your progress!</p>
        <div className="buttons">
          <Link to="/Userlogin" style={{ textDecoration: "none" }}>
            <button className="home-btn user-btn">
              <strong>User Login</strong>
            </button>
          </Link>
          <Link to="/Adminlogin" style={{ textDecoration: "none" }}>
            <button className="home-btn admin-btn">
              <strong>Admin Login</strong>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
