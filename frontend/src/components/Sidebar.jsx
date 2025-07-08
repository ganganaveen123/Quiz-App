import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCog, FaUsers, FaBookOpen, FaSignOutAlt } from 'react-icons/fa'; // 🎯 Added Icons
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Add your logout logic here (like clearing localStorage or cookies)

    alert("Admin signed out successfully");
    navigate('/adminlogin');

    // For now, just redirect to login
    alert("Admin signed out successfully");
    navigate('/');
  };

  return (
    <div className="top-navbar">
      <div className="navbar-left">
        <span className="logo">
          <Link to="/AdminDashboard" className="user-link">
            <FaUserCog style={{ marginRight: '8px' }} /> Admin Panel
          </Link>
        </span>
      </div>

      <div className="navbar-right">
        <Link to="/UserList" className="user-link">
          <FaUsers style={{ marginRight: '6px' }} /> User List
        </Link>
        <Link to="/CourseList" className="course-link">
          <FaBookOpen style={{ marginRight: '6px' }} /> Course List
        </Link>
        <button className="signout-btn" onClick={handleSignOut}>
          <FaSignOutAlt style={{ marginRight: '8px' }} /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
