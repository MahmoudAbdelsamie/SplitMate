const { createGroup } = require('../controllers/groupController');

const router = require('express').Router();


router
    .route('/groups')
    .post(createGroup)






module.exports = router