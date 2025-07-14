import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import './AdminDashboard.css';
import { Modal } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { useLocation } from 'react-router-dom';
import { PieChart, Pie, Cell } from 'recharts';

const AdminAnalytics = () => {
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();

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
        scores: [],
        subjectScores: {},
      };
    }
    userStats[userId].quizzes += 1;
    userStats[userId].scores.push({
      course: result.courseName,
      score: result.score,
      date: result.submittedAt,
    });
    // Aggregate subject/course scores
    if (!userStats[userId].subjectScores[result.courseName]) {
      userStats[userId].subjectScores[result.courseName] = [];
    }
    userStats[userId].subjectScores[result.courseName].push(result.score);
  });

  // Prepare subject-wise chart data for selected user
  const getSubjectChartData = (user) => {
    if (!user || !user.subjectScores) return [];
    return Object.entries(user.subjectScores).map(([course, scores]) => ({
      course,
      avgScore: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2),
      attempts: scores.length
    }));
  };

  // Prepare subject-wise pie chart data for selected user
  const getSubjectPieData = (user) => {
    if (!user || !user.subjectScores) return [];
    const total = Object.values(user.subjectScores).flat().reduce((a, b) => a + b, 0);
    return Object.entries(user.subjectScores).map(([course, scores]) => ({
      name: course,
      value: scores.reduce((a, b) => a + b, 0),
      percent: total ? ((scores.reduce((a, b) => a + b, 0) / total) * 100).toFixed(1) : 0
    }));
  };
  const COLORS = ['#fa8507', '#1e3a8a', '#82ca9d', '#8884d8', '#ffc658', '#ff8042', '#8dd1e1'];

  // Only show users who have participated in at least one quiz
  const usersWithQuizzes = Object.entries(userStats).filter(([_, stats]) => stats.quizzes > 0);

  // Auto-open modal if userId is passed in navigation state
  useEffect(() => {
    if (!loading && location.state && location.state.userId) {
      const stats = userStats[location.state.userId];
      if (stats) {
        setSelectedUser(stats);
        setModalOpen(true);
      } else {
        setSelectedUser({ name: 'No Data', scores: [], subjectScores: {} });
        setModalOpen(true);
      }
    }
    // eslint-disable-next-line
  }, [loading, location.state]);

  const handleUserClick = (userId) => {
    setSelectedUser(userStats[userId] || { name: 'No Data', scores: [], subjectScores: {} });
    setModalOpen(true);
  };

  if (loading) return <div className="admin-container"><Sidebar /><div className="dashboard-main-content"><h2>Loading analytics...</h2></div></div>;
  if (error) return <div className="admin-container"><Sidebar /><div className="dashboard-main-content"><h2>{error}</h2></div></div>;

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="dashboard-main-content">
        <h2 style={{ textAlign: 'center', marginBottom: 30 }}>User Quiz Analytics</h2>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h3>Users who participated:</h3>
          {usersWithQuizzes.length === 0 ? (
            <p style={{ textAlign: 'center', marginTop: 20 }}>No users have participated in quizzes yet.</p>
          ) : (
            <table className="dashboard-table" style={{ marginTop: 10, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Quizzes Taken</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersWithQuizzes.map(([userId, stats], idx) => (
                  <tr key={userId} style={{ background: idx % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                    <td>{stats.name || 'N/A'}</td>
                    <td>{stats.email || 'N/A'}</td>
                    <td style={{ textAlign: 'center' }}>{stats.quizzes}</td>
                    <td>
                      <button
                        style={{
                          background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontWeight: 600
                        }}
                        onClick={() => handleUserClick(userId)}
                      >
                        View Analytics
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <div style={{ background: '#fff', padding: 30, borderRadius: 12, maxWidth: 800, minWidth: 400, margin: '60px auto', outline: 'none' }}>
            {selectedUser && selectedUser.scores && selectedUser.scores.length > 0 ? (
              <>
                <h3 style={{ textAlign: 'center', marginBottom: 20 }}>{selectedUser.name}'s Subject-wise Performance</h3>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <ResponsiveContainer width={500} height={350}>
                    <PieChart>
                      <Pie
                        data={getSubjectPieData(selectedUser)}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({ name, percent }) => `${name}: ${percent}%`}
                      >
                        {getSubjectPieData(selectedUser).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
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
            ) : (
              <div style={{ textAlign: 'center', fontSize: 18, color: '#888', padding: 40 }}>
                No quiz data available for this user.
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminAnalytics; 