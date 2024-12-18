const { registerController, loginController } = require('../controllers/authController');

const router = require('express').Router();


router
    .route('/auth/register')
    .post(registerController)


router
    .route('/auth/login') 
    .post(loginController)

module.exports = router;