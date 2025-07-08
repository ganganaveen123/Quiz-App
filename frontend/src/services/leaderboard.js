 import axios from "axios";

 export const getLeaderboardByCourse = async (courseName) => {
    const encodedCourseName = encodeURIComponent(courseName)
   const response = await axios.get(`http://localhost:5000/api/leaderboard/${encodedCourseName}`);
   return response.data;
 };
