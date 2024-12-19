const { registerController, loginController, getUserProfile } = require('../controllers/authController');

const router = require('express').Router();


router
    .route('/auth/register')
    .post(registerController)


router
    .route('/auth/login') 
    .post(loginController)

router
    .route('/user/:id')
    .get(getUserProfile)


module.exports = router;