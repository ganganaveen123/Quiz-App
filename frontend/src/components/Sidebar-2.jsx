import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBook, FaTrophy, FaCertificate, FaChartBar, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Sidebar-2.css';

const Sidebar2 = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    alert("User logged out successfully");
    navigate('/'); // Adjust this to your login route
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.sidebar') && !event.target.closest('.mobile-menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle" 
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/UserDashboard" className="navlink" onClick={() => setIsMobileMenuOpen(false)}>
              <FaHome className="nav-icon" /> Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/courses" className="navlink" onClick={() => setIsMobileMenuOpen(false)}>
              <FaBook className="nav-icon" /> Courses
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/leaderboard" className="navlink" onClick={() => setIsMobileMenuOpen(false)}>
              <FaTrophy className="nav-icon" /> Leaderboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/certificate" className="navlink" onClick={() => setIsMobileMenuOpen(false)}>
              <FaCertificate className="nav-icon" /> Certificate
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/analytics" className="navlink" onClick={() => setIsMobileMenuOpen(false)}>
              <FaChartBar className="nav-icon" /> Analytics
            </Link>
          </li>
        </ul>
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="nav-icon" /> Logout
        </button>
      </aside>
    </>
  );
};

export default Sidebar2;
