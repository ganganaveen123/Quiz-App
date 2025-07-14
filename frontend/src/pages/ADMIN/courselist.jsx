import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from '../../components/Sidebar';
import { FaBook, FaPlus, FaRegFileAlt } from 'react-icons/fa'; // Removed FaEdit
import './courselist.css';
import { toast } from 'react-toastify';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState("");
  const [addCourseError, setAddCourseError] = useState(""); // Error state for Add Course
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("https://quiz-app-dq18.onrender.com/api/courses");
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses", error);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourseName.trim()) {
      setAddCourseError("Course name is required!");
      setIsSubmitted(true);
      return;
    }
    try {
      const res = await axios.post("https://quiz-app-dq18.onrender.com/api/courses/addcourse", {
        name: newCourseName,
      });

      setNewCourseName("");
      setAddCourseError(""); // Clear error on successful add
      setIsSubmitted(false); // Hide any error messages
      fetchCourses(); // Refresh course list

      toast.success("Course added successfully!");
    } catch (error) {
      setIsSubmitted(true); // Trigger message display
      if (error.response?.data?.message) {
        setAddCourseError(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setAddCourseError("Something went wrong while adding the course. Please try again.");
        toast.error("Something went wrong while adding the course. Please try again.");
      }
    }
  };

  return (
    <div className="course-page">
      <Sidebar />
      <div className="centered-content">
        <div className="main-container">
          <h2>📚 Course Management</h2>

          {/* Course List */}
          <div className="course-list">
            {courses.map((course) => (
              <div className="course-box" key={course.id}>
                <h3><FaBook /> {course.name}</h3>
                <div className="button-group">
                  <button onClick={() => navigate(`/courses/${course.name}/topics`)}>
                    <FaRegFileAlt /> View Topics
                  </button>
                  <button onClick={() => navigate(`/courses/${course.name}/questions`)}>
                    <FaRegFileAlt /> View Questions
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Course */}
          <form className="add-course-form" onSubmit={handleAddCourse}>
            <h3><FaBook /> ➕ Add New Course</h3>
            {isSubmitted && addCourseError && <p className="message">{addCourseError}</p>}
            <input
              type="text"
              placeholder="Course Name"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
            />
            <button type="submit">
              <FaPlus /> Add Course
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseList;
