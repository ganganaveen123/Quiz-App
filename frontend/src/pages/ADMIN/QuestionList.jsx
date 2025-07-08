import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaPlus } from 'react-icons/fa';
import "./QuestionList.css"; // Make sure you have the CSS

const QuestionList = () => {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [newQuestionData, setNewQuestionData] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "",
  });
  const [editQuestionData, setEditQuestionData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/topics/${courseName}`);
        setTopics(response.data || []);
      } catch (err) {
        console.error("Error fetching course topics:", err);
      }
    };
    fetchTopics();
  }, [courseName]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedTopicId) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/api/courses/questions/${courseName}/${selectedTopicId}`
        );
        setQuestions(response.data || []);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };
    fetchQuestions();
  }, [courseName, selectedTopicId]);

  const handleTopicSelect = (e) => {
    setSelectedTopicId(e.target.value);
    setEditQuestionData(null); // Clear editing
  };

  const handleInputChange = (e, index) => {
    const updatedOptions = [...newQuestionData.options];
    updatedOptions[index] = e.target.value;
    setNewQuestionData({ ...newQuestionData, options: updatedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestionData.question.trim()) {
      setError("Question is required!");
      return;
    }
    try {
      await axios.post(
        `http://localhost:5000/api/courses/addcourse/${courseName}/topics/${selectedTopicId}/questions`,
        {
          question: newQuestionData.question,
          options: newQuestionData.options,
          answer: newQuestionData.answer,
        }
      );
      const response = await axios.get(
        `http://localhost:5000/api/courses/questions/${courseName}/${selectedTopicId}`
      );
      setQuestions(response.data || []);
      setNewQuestionData({ question: "", options: ["", "", "", ""], answer: "" });
      setError("");
    } catch (err) {
      console.error("Error adding question:", err);
      setError("Failed to add question.");
    }
  };

  const handleEdit = (question) => {
    setEditQuestionData({ ...question });
  };

  const handleEditChange = (e, index) => {
    const updatedOptions = [...editQuestionData.options];
    updatedOptions[index] = e.target.value;
    setEditQuestionData({ ...editQuestionData, options: updatedOptions });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editQuestionData.question.trim()) {
      setError("Question is required!");
      return;
    }
    try {
      await axios.put(
        `http://localhost:5000/api/courses/updatequestion/${courseName}/${selectedTopicId}/${editQuestionData.id}`,
        {
          question: editQuestionData.question,
          options: editQuestionData.options,
          answer: editQuestionData.answer,
        }
      );
      const response = await axios.get(
        `http://localhost:5000/api/courses/questions/${courseName}/${selectedTopicId}`
      );
      setQuestions(response.data || []);
      setEditQuestionData(null);
      setError("");
    } catch (err) {
      console.error("Error updating question:", err);
      setError("Failed to update question.");
    }
  };

  return (
    <div className="question-list-container">
      {/* Go Back Button */}
      <button onClick={() => navigate("/courselist")} className="go-back-button">
        <FaArrowLeft /> Prev Page
      </button>

      {/* Content */}
      <div className="question-list-content">
        <h2>Questions for "{courseName}"</h2>

        {/* Topic Dropdown */}
        <div className="dropdown-container">
          <label>Select Topic:</label>
          <select value={selectedTopicId} onChange={handleTopicSelect} className="dropdown-select">
            <option value="">-- Select Topic --</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        {/* Questions Section */}
        {selectedTopicId && (
          <>
            <h3>Questions List</h3>
            {questions.length > 0 ? (
              <ul className="question-list">
                {questions.map((q) => (
                  <li key={q.id} className="question-item">
                    <p><strong>Question:</strong> {q.question}</p>
                    <ul className="option-list">
                      {q.options.map((option, index) => (
                        <li key={index}>{option}</li>
                      ))}
                    </ul>
                    <button onClick={() => handleEdit(q)} className="edit-button">
                      <FaEdit /> Edit
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No questions found for this topic.</p>
            )}
          </>
        )}
      </div>

      {/* Right Side: Forms Section */}
      <div className="question-list-form">
        {selectedTopicId && (
          <>
            {/* Edit Form */}
            {editQuestionData && (
              <form onSubmit={handleEditSubmit} className="edit-question-form">
                {error && <p className="error-message">{error}</p>}
                <div>
                  <label>Enter Question</label>
                  <input
                    type="text"
                    value={editQuestionData.question}
                    onChange={(e) => setEditQuestionData({ ...editQuestionData, question: e.target.value })}
                    required
                  />
                </div>

                {editQuestionData.options.map((option, index) => (
                  <div key={index}>
                    <label>Option {index + 1}</label>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleEditChange(e, index)}
                      required
                    />
                  </div>
                ))}

                <div>
                  <label>Correct Answer</label>
                  <input
                    type="text"
                    value={editQuestionData.answer}
                    onChange={(e) => setEditQuestionData({ ...editQuestionData, answer: e.target.value })}
                    required
                  />
                </div>

                <div className="button-container">
                  <button type="submit" className="submit-button">Update Question</button>
                  <button type="button" onClick={() => setEditQuestionData(null)} className="cancel-button">Cancel</button>
                </div>
              </form>
            )}

            {/* Add Form - Always visible */}
            <form onSubmit={handleSubmit} className="add-question-form">
              {error && <p className="error-message">{error}</p>}
              <div>
                <label>Enter Question</label>
                <input
                  type="text"
                  value={newQuestionData.question}
                  onChange={(e) => setNewQuestionData({ ...newQuestionData, question: e.target.value })}
                  required
                />
              </div>

              {newQuestionData.options.map((option, index) => (
                <div key={index}>
                  <label>Option {index + 1}</label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleInputChange(e, index)}
                    required
                  />
                </div>
              ))}

              <div>
                <label>Correct Answer</label>
                <input
                  type="text"
                  value={newQuestionData.answer}
                  onChange={(e) => setNewQuestionData({ ...newQuestionData, answer: e.target.value })}
                  required
                />
              </div>

              <div className="button-container">
                <button type="submit" className="submit-button">Add Question</button>
                <button type="button" onClick={() => setNewQuestionData({ question: "", options: ["", "", "", ""], answer: "" })} className="cancel-button">Cancel</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionList;
