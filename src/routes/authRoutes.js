const express = require('express');
const {
  registerController,
  loginController,
  getUserProfile,
  editUserProfile,
  deleteUser,
} = require('../controllers/authController');

const router = express.Router();

// Define routes
router.post('/auth/register', registerController);
router.post('/auth/login', loginController);
router
  .route('/users/:id')
  .get(getUserProfile)
  .patch(editUserProfile)
  .delete(deleteUser);

module.exports = router;