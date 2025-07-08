import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Courses.css";
import Sidebar2 from "../components/Sidebar-2";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses/");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar2/>
      <main className="main-content">
        <h1>Courses</h1>

        {loading ? (
          <p>Loading courses...</p>
        ) : (
          <div className="courses-grid">
            {courses.map((course, index) => {
              
              const path = `/courses/${course.name}`;
              return (
                <Link key={index} to={path} className="course-box">
                 
                  <h2>{course.name}</h2>
            
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Courses;
