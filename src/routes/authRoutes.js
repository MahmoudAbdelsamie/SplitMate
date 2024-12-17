const { registerController } = require('../controllers/authController');

const router = require('express').Router();


router
    .route('/auth/register')
    .post(registerController)


module.exports = router;