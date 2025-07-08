import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaPlus } from "react-icons/fa"; // <-- Importing icons
import "./TopicList.css";

const TopicList = () => {
  const { courseName } = useParams();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTopicName, setEditingTopicName] = useState("");
  const [newTopicName, setNewTopicName] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const formattedCourseName = decodeURIComponent(courseName);
        const response = await fetch(`http://localhost:5000/api/courses/topics/${formattedCourseName}`);
        if (!response.ok) throw new Error("Failed to fetch topics");
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [courseName]);

  const handleUpdateTopic = async (topicId) => {
    if (!editingTopicName.trim()) {
      setError("Topic name cannot be empty!");
      setIsSubmitted(true);
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/courses/updatetopic/${courseName}/${topicId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingTopicName }),
      });
      if (!response.ok) throw new Error("Failed to update topic name");

      const updatedTopics = topics.map((topic) =>
        topic.id === topicId ? { ...topic, name: editingTopicName } : topic
      );
      setTopics(updatedTopics);
      setIsEditing(null);
      setEditingTopicName("");
      setError("");
      setIsSubmitted(false);
      alert("Topic name updated successfully!");
    } catch (error) {
      console.error("Error updating topic name:", error);
      setError("Failed to update topic name");
      setIsSubmitted(true);
    }
  };

  const handleAddTopic = async () => {
    if (!newTopicName.trim()) {
      setError("Topic name is required!");
      setIsSubmitted(true);
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/courses/addcourse/${courseName}/topics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTopicName }),
      });
      if (!response.ok) throw new Error("Failed to add topic");

      const updatedResponse = await fetch(`http://localhost:5000/api/courses/topics/${courseName}`);
      const updatedData = await updatedResponse.json();
      setTopics(updatedData);
      setNewTopicName("");
      setError("");
      setIsAdding(false);
      setIsSubmitted(false);
      alert("Topic added successfully!");
    } catch (error) {
      console.error("Error adding topic:", error);
      setError("Failed to add topic");
      setIsSubmitted(true);
    }
  };

  const handleCancelAdd = () => {
    setNewTopicName("");
    setIsAdding(false);
    setError("");
    setIsSubmitted(false);
  };

  if (loading) return <h2 className="loading-text">Loading...</h2>;

  return (
    <div className="course-topics-container">
      <div className="course-topics-box">
        <h1 className="course-topics-title">{courseName} Topics</h1>
        <ul className="course-topics-list">
          {topics.map((topic) => (
            <li key={topic.id} className="course-topic-item">
              {isEditing === topic.id ? (
                <div className="edit-topic-container">
                  <input
                    type="text"
                    value={editingTopicName}
                    onChange={(e) => setEditingTopicName(e.target.value)}
                    placeholder="Edit Topic Name"
                  />
                  <div className="edit-buttons">
                    <button onClick={() => handleUpdateTopic(topic.id)} className="save-button">Save</button>
                    <button onClick={() => setIsEditing(null)} className="cancel-button">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="topic-name">
                  <span className="topic-text">{topic.name}</span>
                  <button
                    className="edit-topic-button"
                    onClick={() => {
                      setIsEditing(topic.id);
                      setEditingTopicName(topic.name);
                    }}
                  >
                    <FaEdit style={{ marginRight: "5px" }} />
                    Edit
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="add-topic-form">
          {isAdding ? (
            <>
              {isSubmitted && error && <p className="error-message">{error}</p>}
              <input
                type="text"
                placeholder="Enter New Topic Name"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
              />
              <div className="edit-buttons">
                <button onClick={handleAddTopic} className="save-button">Save</button>
                <button onClick={handleCancelAdd} className="cancel-button">Cancel</button>
              </div>
            </>
          ) : (
            <button onClick={() => setIsAdding(true)} className="add-button">
              <FaPlus style={{ marginRight: "5px" }} />
              Add Topic
            </button>
          )}
        </div>

        <div className="back-button-container">
          <button onClick={() => navigate("/CourseList")} className="back-button">
            Prev Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicList;
