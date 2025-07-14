import React, { useEffect, useState } from 'react';
import "./UserList.css";
import Sidebar from '../../components/Sidebar';
import { toast } from 'react-toastify';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      console.log('Token:', token); // Debug log
      console.log('Current user:', user); // Debug log
      console.log('User role:', user.role); // Debug log
      
      // Check if user is admin
      if (!user.role || user.role !== 'admin') {
        setError('Access denied. Only admin users can view this page.');
        setLoading(false);
        return;
      }
      
      const response = await fetch('https://quiz-app-dq18.onrender.com/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status); // Debug log
      console.log('Response headers:', response.headers); // Debug log
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText); // Debug log
        throw new Error(`Failed to fetch users: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data); // Debug log
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(`Failed to load users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://quiz-app-dq18.onrender.com/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setUsers(prev => prev.filter(user => user._id !== id));
        toast.success('User deleted successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user. Please try again.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="OUTER_CONTAINER">
        <Sidebar />
        <div className="INNER_CONTAINER">
          <h2 style={{ textAlign: "center" }}>Loading users...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="OUTER_CONTAINER">
        <Sidebar />
        <div className="INNER_CONTAINER">
          <h2 style={{ textAlign: "center", color: "red" }}>{error}</h2>
          <button onClick={fetchUsers} style={{ margin: "20px auto", display: "block" }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="OUTER_CONTAINER">
      <Sidebar />
      <div className="INNER_CONTAINER">
        {/* Debug Information */}
        <div style={{ 
          background: '#f0f0f0', 
          padding: '10px', 
          marginBottom: '20px', 
          borderRadius: '5px',
          fontSize: '12px'
        }}>
          <strong>Debug Info:</strong><br/>
          Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}<br/>
          User: {localStorage.getItem('user') ? 'Present' : 'Missing'}<br/>
          User Role: {JSON.parse(localStorage.getItem('user') || '{}').role || 'None'}<br/>
        </div>

      <h2 style={{ textAlign: "center" }}>User List</h2>

        {users.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>No users found.</p>
        ) : (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
                <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                  <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleDelete(user._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default UserList;
