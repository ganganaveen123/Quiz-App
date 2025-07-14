import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#fa8507', '#1e3a8a', '#82ca9d', '#8884d8', '#ffc658', '#ff8042', '#8dd1e1'];

const UserAnalyticsView = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        // Fetch user analytics (subject-wise)
        const res = await fetch(`https://quiz-app-dq18.onrender.com/api/user/${userId}/analytics`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        setError('Failed to load analytics');
      }
    };
    const fetchUserScores = async () => {
      try {
        const token = localStorage.getItem('token');
        // Fetch all quiz attempts for this user
        const res = await fetch(`https://quiz-app-dq18.onrender.com/api/admin/user-results`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch user scores');
        const data = await res.json();
        // Find this user's results
        const userResults = data.userResults.filter(r => (r.userId?._id || r.userId) === userId);
        setUser(userResults[0]?.userId || null);
        setScores(userResults.map(r => ({ course: r.courseName, score: r.score, date: r.submittedAt })));
      } catch (err) {
        setError('Failed to load user scores');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
    fetchUserScores();
  }, [userId]);

  if (loading) return <div className="admin-container"><Sidebar /><div className="dashboard-main-content"><h2>Loading analytics...</h2></div></div>;
  if (error) return <div className="admin-container"><Sidebar /><div className="dashboard-main-content"><h2>{error}</h2></div></div>;

  return (
    <div className="admin-container" style={{ background: '#f8f6f2', minHeight: '100vh' }}>
      <Sidebar />
      <div className="dashboard-main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 32 }}>
        <button onClick={() => navigate(-1)} style={{ alignSelf: 'flex-start', marginBottom: 24, background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}>Back</button>
        <h2 style={{ textAlign: 'center', marginBottom: 32 }}>{user?.name || 'User'}'s Subject-wise Performance</h2>
        <div style={{ width: 600, maxWidth: '100%', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #e0e0e0', padding: 32, marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ResponsiveContainer width={500} height={350}>
            <PieChart>
              <Pie
                data={analytics.map(d => ({ name: d.courseName || 'Unknown', value: d.averageScore }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={140}
                labelLine={false}
                label={({ percent }) => `${percent}%`}
              >
                {analytics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 16 }}>
            {analytics.map((entry, idx) => (
              <div key={entry.courseName || 'Unknown'} style={{ display: 'flex', alignItems: 'center', margin: '0 16px 8px 0' }}>
                <div style={{ width: 16, height: 16, background: COLORS[idx % COLORS.length], borderRadius: 4, marginRight: 8 }}></div>
                <span style={{ fontSize: 15 }}>{entry.courseName || 'Unknown'}</span>
              </div>
            ))}
          </div>
        </div>
        <table className="dashboard-table" style={{ width: 600, maxWidth: '100%', margin: '0 auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
          <thead>
            <tr style={{ background: '#1e3a8a', color: '#fff' }}>
              <th>Course</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, idx) => (
              <tr key={idx}>
                <td>{s.course}</td>
                <td>{s.score}</td>
                <td>{new Date(s.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserAnalyticsView; 