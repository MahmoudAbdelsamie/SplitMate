const { createGroup, addGroupMembers } = require('../controllers/groupController');

const router = require('express').Router();


router
    .route('/groups')
    .post(createGroup)

router
    .route('/groups/:id/members')
    .post(addGroupMembers)




module.exports = router