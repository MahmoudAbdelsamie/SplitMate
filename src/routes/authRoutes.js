const { registerController, loginController, getUserProfile, editUserProfile, deleteUser } = require('../controllers/authController');

const router = require('express').Router();


router
    .route('/auth/register')
    .post(registerController)


router
    .route('/auth/login') 
    .post(loginController)

router
    .route('/users/:id')
    .get(getUserProfile)
    .patch(editUserProfile)
    .delete(deleteUser)


module.exports = router;