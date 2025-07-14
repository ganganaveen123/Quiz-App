import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import './AdminDashboard.css';
import { Modal } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const AdminAnalytics = () => {
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://quiz-app-dq18.onrender.com/api/admin/user-results', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch analytics');
        const data = await response.json();
        setUserResults(data.userResults);
      } catch (err) {
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  // Aggregate user stats
  const userStats = {};
  userResults.forEach(result => {
    const userId = result.userId?._id || result.userId;
    if (!userStats[userId]) {
      userStats[userId] = {
        name: result.userId?.name || result.username,
        email: result.userId?.email || '',
        quizzes: 0,
        totalScore: 0,
        bestScore: 0,
        lastQuiz: null,
        scores: [],
      };
    }
    userStats[userId].quizzes += 1;
    userStats[userId].totalScore += result.score;
    userStats[userId].bestScore = Math.max(userStats[userId].bestScore, result.score);
    userStats[userId].lastQuiz = !userStats[userId].lastQuiz || new Date(result.submittedAt) > new Date(userStats[userId].lastQuiz)
      ? result.submittedAt : userStats[userId].lastQuiz;
    userStats[userId].scores.push({
      course: result.courseName,
      score: result.score,
      date: result.submittedAt,
    });
  });

  const handleUserClick = (userId) => {
    setSelectedUser(userStats[userId]);
    setModalOpen(true);
  };

  if (loading) return <div className="admin-container"><Sidebar /><div className="dashboard-main-content"><h2>Loading analytics...</h2></div></div>;
  if (error) return <div className="admin-container"><Sidebar /><div className="dashboard-main-content"><h2>{error}</h2></div></div>;

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="dashboard-main-content">
        <h2 style={{ textAlign: 'center', marginBottom: 30 }}>User Quiz Analytics</h2>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Total Quizzes</th>
              <th>Avg Score</th>
              <th>Best Score</th>
              <th>Last Quiz</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(userStats).map(([userId, stats]) => (
              <tr key={userId}>
                <td>{stats.name}</td>
                <td>{stats.email}</td>
                <td>{stats.quizzes}</td>
                <td>{(stats.totalScore / stats.quizzes).toFixed(2)}</td>
                <td>{stats.bestScore}</td>
                <td>{stats.lastQuiz ? new Date(stats.lastQuiz).toLocaleString() : '-'}</td>
                <td><button onClick={() => handleUserClick(userId)}>View Analytics</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <div style={{ background: '#fff', padding: 30, borderRadius: 12, maxWidth: 600, margin: '60px auto', outline: 'none' }}>
            {selectedUser && (
              <>
                <h3 style={{ textAlign: 'center', marginBottom: 20 }}>{selectedUser.name}'s Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={selectedUser.scores.map(s => ({ ...s, date: new Date(s.date).toLocaleDateString() }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#fa8507" name="Score" />
                  </BarChart>
                </ResponsiveContainer>
                <table className="dashboard-table" style={{ marginTop: 20 }}>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Score</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUser.scores.map((s, idx) => (
                      <tr key={idx}>
                        <td>{s.course}</td>
                        <td>{s.score}</td>
                        <td>{new Date(s.date).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminAnalytics; 