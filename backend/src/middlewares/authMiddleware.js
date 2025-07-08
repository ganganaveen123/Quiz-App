// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const protect = async (req, res, next) => {
//     try {
//         let token = req.header("Authorization");
//         if (!token) return res.status(401).json({ message: "Access denied" });

//         token = token.replace("Bearer ", "");
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id).select("-password");

//         next();
//     } catch (error) {
//         res.status(401).json({ message: "Invalid token" });
//     }
// };

// const isAdmin = (req, res, next) => {
//     if (req.user && req.user.role === "admin") {
//         next();
//     } else {
//         res.status(403).json({ message: "Access denied, admin only" });
//     }
// };

// module.exports = { protect, isAdmin };

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'your-jwt-secret');
    const user = await User.findById(decoded.userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Not authorized' });
  }
};

module.exports = isAdmin;
