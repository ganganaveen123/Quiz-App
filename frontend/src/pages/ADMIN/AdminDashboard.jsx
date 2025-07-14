import React from 'react';
import Sidebar from '../../components/Sidebar';
import './AdminDashboard.css';
import { FaUsers, FaBookOpen, FaChartBar } from 'react-icons/fa';
import dashboardImage from '../../assets/quiz-5.jpg'; // Ensure correct path
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="admin-container">
      <Sidebar />
      <div className="dashboard-main-content modern-admin-bg">
        <section className="admin-hero-card">
          <h1>
            Welcome, <span className="highlight">Admin</span>
          </h1>
          <p>
            Your control center for managing users, courses, and analytics. Make impactful changes and keep your platform running smoothly!
          </p>
        </section>

        <div className="admin-action-cards">
          <Link to="/UserList" className="admin-action-card">
            <FaUsers className="admin-action-icon" />
            <span>Manage Users</span>
          </Link>
          <Link to="/CourseList" className="admin-action-card">
            <FaBookOpen className="admin-action-icon" />
            <span>Manage Courses</span>
          </Link>
          <Link to="/analytics" className="admin-action-card">
            <FaChartBar className="admin-action-icon" />
            <span>View Analytics</span>
          </Link>
        </div>

        <div className="admin-dashboard-image-section">
          <img
            src={dashboardImage}
            alt="Dashboard Visual"
            className="dashboard-hero-image"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
