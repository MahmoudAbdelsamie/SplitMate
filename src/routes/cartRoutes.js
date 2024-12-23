const express = require('express');
const { createCart, addItemToCart } = require('../controllers/cartController');


const router = express.Router();


router.route('/carts').post(createCart);

router
    .route('/carts/:id/add-item')
    .patch(addItemToCart)



module.exports = router