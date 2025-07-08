import React from 'react';
import Sidebar from '../../components/Sidebar';
import './AdminDashboard.css';
import dashboardImage from '../../assets/quiz-5.jpg'; // Ensure correct path

const AdminDashboard = () => {
  return (
    <div className="admin-container">
      <Sidebar />
      <div className="dashboard-main-content">
        <section className="admin-welcome animate-slide">
          <h1>
            Welcome to the <span className="highlight">Admin Dashboard</span>
          </h1>
          <p>
            Manage users, courses, and system settings all in one place. You have full control
            over what happens behind the scenes.
          </p>
        </section>

        <div className="dashboard-info-section animate-fade">
          <div className="dashboard-info-text">
            <h2>📊 Admin Control Center</h2>
            <p>
              From monitoring course data to managing users, your dashboard provides seamless access
              to everything. Navigate using the sidebar to get started.
            </p>
            <ul>
              <li>View and edit user lists</li>
              <li>Manage course uploads</li>
              <li>Review analytics</li>
            </ul>
          </div>

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
