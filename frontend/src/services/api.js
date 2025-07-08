import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/api/auth"; // Backend URL

// User Registration
export const registerUser = async (userData) => {
    console.log(userData);
    return await axios.post(`${API_BASE_URL}`, userData);
};

// User Login
export const loginUser = async (loginData) => {
    return await axios.post(`${API_BASE_URL}`, loginData);
    
};

// Admin Registration
export const registerAdmin = async (adminData) => {
    return await axios.post(`${API_BASE_URL}`, adminData);
};

// Admin Login
export const loginAdmin = async (adminLoginData) => {
    return await axios.post(`${API_BASE_URL}`, adminLoginData);
};
