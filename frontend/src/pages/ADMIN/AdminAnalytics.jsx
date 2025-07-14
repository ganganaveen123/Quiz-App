import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import './AdminDashboard.css';
import { Modal } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { useLocation, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell } from 'recharts';

const AdminAnalytics = () => {
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
      } else {
        setSelectedUser({ name: 'No Data', scores: [], subjectScores: {} });
      }
    }
    // eslint-disable-next-line
  }, [loading, location.state]);

  // Set default selected user to the first in the list
  useEffect(() => {
    if (!selectedUser && usersWithQuizzes.length > 0) {
      setSelectedUser(usersWithQuizzes[0][1]);
    }
  }, [usersWithQuizzes, selectedUser]);

  const handleUserClick = (userId) => {
    setSelectedUser(userStats[userId] || { name: 'No Data', scores: [], subjectScores: {} });
  };

  // Custom legend for pie chart
  const renderCustomLegend = (data) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 16 }}>
      {data.map((entry, idx) => (
        <div key={entry.name} style={{ display: 'flex', alignItems: 'center', margin: '0 16px 8px 0' }}>
          <div style={{ width: 16, height: 16, background: COLORS[idx % COLORS.length], borderRadius: 4, marginRight: 8 }}></div>
          <span style={{ fontSize: 15 }}>{entry.name || 'Unknown'}</span>
        </div>
      ))}
    </div>
  );

  if (loading) return <div className="admin-container"><Sidebar /><div className="dashboard-main-content"><h2>Loading analytics...</h2></div></div>;
  if (error) return <div className="admin-container"><Sidebar /><div className="dashboard-main-content"><h2>{error}</h2></div></div>;

  return (
    <div className="admin-container">
      <Sidebar />
      <div
        className="dashboard-main-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#f5f5f5',
          padding: '20px',
        }}
      >
        <div
          style={{
            width: 500,
            maxWidth: '100%',
            background: '#f8f9fa',
            borderRadius: 12,
            boxShadow: '0 2px 8px #eee',
            padding: 24,
            margin: '0 auto',
          }}
        >
          <h3 style={{ textAlign: 'center' }}>Users who participated:</h3>
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
                  <tr
                    key={userId}
                    style={{
                      background: idx % 2 === 0 ? '#f9f9f9' : '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    <td>{stats.name || 'N/A'}</td>
                    <td>{stats.email || 'N/A'}</td>
                    <td style={{ textAlign: 'center' }}>{stats.quizzes}</td>
                    <td>
                      <button
                        style={{
                          background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 14
                        }}
                        onClick={() => navigate(`/admin/analytics/${userId}`)}
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
      </div>
    </div>
  );
};

export default AdminAnalytics; 