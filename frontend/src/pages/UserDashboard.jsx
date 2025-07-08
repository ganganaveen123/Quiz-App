import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./UserDashboard.css";
import { FaTrophy, FaChartLine, FaQuestionCircle, FaCertificate } from "react-icons/fa";
import quizImg from "../assets/image.png";
import Sidebar2 from "../components/Sidebar-2";

const UserDashboard = () => {
  const navigate = useNavigate();
  const Username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    alert("User signed out successfully");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <Sidebar2/>
      <main className="main-content">
        <motion.div
          className="intro-section"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            🎓 Welcome <span className="highlight-text">{Username}</span>
          </motion.h1>

          <motion.p
            className="tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
          Empowering B.Tech students preparing for GATE, placements & beyond!
          </motion.p>

          <div className="dashboard-content">
            <motion.div
              className="dashboard-text"
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <h2>📘 What is a Quiz?</h2>
              <p>
                A quiz is an interactive tool designed to assess your understanding and sharpen your knowledge.
                Our quizzes are built to be engaging, insightful, and effective.
              </p>
              <p className="animated-facts">
                🚀 Quick to answer <br />
                🎯 Targeted for core subjects <br />
                🧠 Smart preparation for <strong>GATE</strong> and <strong>Placements</strong>
              </p>
            </motion.div>

            <motion.img
              src={quizImg}
              alt="Quiz Illustration"
              className="dashboard-image"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            />
          </div>

          <motion.div
            className="features-grid"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          >
            <Link to="/courses" className="feature-link">
              <motion.div className="feature-card" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <FaQuestionCircle className="feature-icon" />
                Topic-wise Quizzes
              </motion.div>
            </Link>

            <Link to="/analytics" className="feature-link">
              <motion.div className="feature-card" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <FaChartLine className="feature-icon" />
                Performance Analytics
              </motion.div>
            </Link>

            <Link to="/leaderboard" className="feature-link">
              <motion.div className="feature-card" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <FaTrophy className="feature-icon" />
                Live Leaderboard
              </motion.div>
            </Link>

            <Link to="/certificate" className="feature-link">
              <motion.div className="feature-card" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <FaCertificate className="feature-icon" />
                Certification & Recognition
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default UserDashboard;