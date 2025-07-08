import React, { useState, useEffect } from "react"; // Import useState and useEffect
import axios from "axios"; // Import axios
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Link, useNavigate } from "react-router-dom";
import Sidebar2 from "../components/Sidebar-2"; // Make sure Sidebar2 is correctly imported
import "./PerformanceAnalytics.css";

const PerformanceAnalytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        console.error("Token or UserId missing.");
        setError("Authentication error. Please login again.");
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/user/${userId}/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched Analytics:", response.data);

      const transformedData = response.data.map((item) => ({
        name: item.courseName,
        score: item.averageScore,
      }));

      setData(transformedData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError("Failed to load analytics. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <Sidebar2 />
      {/* Sidebar */}

      {/* Analytics Main Section */}
      
      {/* <h2 className="analytics-title">📊 Performance Analytics</h2> */}
      <div className="analytics-container">
      <h2 className="analytics-title">📊 Performance Analytics</h2>
        <p className="analytics-subtitle">
          Track your quiz progress and identify areas to improve.
        </p>

        <div className="chart-wrapper">
          {loading ? (
            <p style={{ textAlign: "center", marginTop: "20px" }}>Loading analytics...</p>
          ) : error ? (
            <p style={{ textAlign: "center", marginTop: "20px", color: "red" }}>{error}</p>
          ) : data.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "20px" }}>No data available yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4CAF50"
                  strokeWidth={3}
                  dot={{ stroke: "#4CAF50", strokeWidth: 2, fill: "#4CAF50" }}
                  activeDot={{ r: 8 }}
                />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} /> {/* 5 is your max average score */}
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
