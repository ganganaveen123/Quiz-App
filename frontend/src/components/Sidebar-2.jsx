import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBook, FaTrophy, FaCertificate, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar-2.css';

const Sidebar2 = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("User logged out successfully");
    navigate('/'); // Adjust this to your login route
  };

  return (
    <aside className="sidebar">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/UserDashboard" className="navlink">
            <FaHome className="nav-icon" /> Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/courses" className="navlink">
            <FaBook className="nav-icon" /> Courses
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/leaderboard" className="navlink">
            <FaTrophy className="nav-icon" /> Leaderboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/certificate" className="navlink">
            <FaCertificate className="nav-icon" /> Certificate
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/analytics" className="navlink">
            <FaChartBar className="nav-icon" /> Analytics
          </Link>
        </li>
      </ul>
      <button className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt className="nav-icon" /> Logout
      </button>
    </aside>
  );
};

export default Sidebar2;
