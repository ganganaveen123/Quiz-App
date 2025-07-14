import React from 'react';
import Sidebar from '../../components/Sidebar';
import './AdminDashboard.css';
import { FaUsers, FaBookOpen, FaChartBar } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
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
          <div className="admin-action-card" onClick={() => navigate('/userlist')} style={{ cursor: 'pointer' }}>
            <FaUsers className="admin-action-icon" />
            <span>Manage Users</span>
          </div>
          <div className="admin-action-card" onClick={() => navigate('/courselist')} style={{ cursor: 'pointer' }}>
            <FaBookOpen className="admin-action-icon" />
            <span>Manage Courses</span>
          </div>
          <div className="admin-action-card" onClick={() => navigate('/analytics')} style={{ cursor: 'pointer' }}>
            <FaChartBar className="admin-action-icon" />
            <span>View Analytics</span>
          </div>
        </div>

        <div className="admin-dashboard-info-section">
          <div className="admin-dashboard-info-card">
            <h3>Platform Aim</h3>
            <ul>
              <li>Empower B.Tech students and GATE aspirants with high-quality quizzes and analytics.</li>
              <li>Provide a seamless admin experience for managing users, courses, and performance data.</li>
              <li>Enable data-driven decisions with real-time analytics and user performance tracking.</li>
              <li>Foster a competitive and supportive learning environment.</li>
            </ul>
            <h4 style={{marginTop: '18px'}}>Key Admin Actions</h4>
            <ul>
              <li>Add, edit, or remove users and courses.</li>
              <li>Monitor user progress and quiz results.</li>
              <li>Analyze platform-wide performance trends.</li>
              <li>Ensure the integrity and quality of quiz content.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
