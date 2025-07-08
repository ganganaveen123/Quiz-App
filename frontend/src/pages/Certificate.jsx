import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Certificate.css";
import Sidebar2 from "../components/Sidebar-2";

const Certificate = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [username, setUsername] = useState(null);
  const [courses, setCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses/");
      console.log("Fetched Courses:", response.data);

      // Expecting course objects like { name: "Python" }
      if (Array.isArray(response.data)) {
        setCourses(response.data);
      } else {
        console.warn("Unexpected response format:", response.data);
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleDownload = async () => {
    if (!username) {
      alert("You must be logged in to download the certificate.");
      return;
    }

    if (!selectedCourse) {
      alert("Please select a course.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/certificate/${username}/${encodeURIComponent(selectedCourse)}`,
        { responseType: "blob" }
      );

      const percentage = response.headers["x-percentage"] || "82.00%";

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${selectedCourse}_Certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);

      setErrorMessage("");
      setSuccessMessage(`🎉 Congratulations! Your certificate has been downloaded. You scored ${percentage} in this course.`);
    } catch (error) {
      setSuccessMessage("");
      if (error.response) {
        try {
          const data = await error.response.data.text();
          const parsed = JSON.parse(data);
          if (parsed.message && parsed.percentage) {
            setErrorMessage(`${parsed.message} Your current score is ${parsed.percentage}.`);
          } else if (parsed.message) {
            setErrorMessage(parsed.message);
          } else {
            setErrorMessage("Something went wrong while downloading.");
          }
        } catch (err) {
          setErrorMessage("Something went wrong while downloading.");
        }
      } else {
        console.error("Error downloading certificate:", error);
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <Sidebar2/>
      {/* Sidebar */}
      {/* <aside className="sidebar">
        <ul className="nav-list">
          <li className="nav-item"><Link to="/UserDashboard" className="nav-link">Home</Link></li>
          <li className="nav-item"><Link to="/courses" className="nav-link">Courses</Link></li>
          <li className="nav-item"><Link to="/leaderboard" className="nav-link">Leaderboard</Link></li>
          <li className="nav-item"><Link to="/certificate" className="nav-link">Certificate</Link></li>
          <li className="nav-item"><Link to="/analytics" className="nav-link">Analytics</Link></li>
          <li><button className="logout-button" onClick={handleLogout}>Logout</button></li>
        </ul>
      </aside> */}

      {/* Main Content */}
      <div className="outbox">
        <div className="certificate-container">
          <div className="certificate-title">Get Your Course Certificate</div>
          <div className="certificate-subtitle">
            Select a course to download your certificate. If you're eligible, it will download. Otherwise, keep practicing!
          </div>

          <select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className="course-dropdown"
          >
            <option value="">Select a Course</option>
            {loadingCourses ? (
              <option disabled>Loading courses...</option>
            ) : (
              courses.map((course, index) => (
                <option key={index} value={course.name}>
                  {course.name}
                </option>
              ))
            )}
          </select>

          <button onClick={handleDownload} className="download-btn">
            Download Certificate
          </button>

          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
      </div>
    </div>
  );
};

export default Certificate;
