const express = require('express');
const adminController = require('../controllers/adminController'); // Import the controller
const router = express.Router();
//const isAdmin = require('../middlewares/authMiddleware');


// Route to fetch all non-admin users
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
// Route to fetch user results with details
router.get('/user-results', adminController.getUserResults);

module.exports = router;
