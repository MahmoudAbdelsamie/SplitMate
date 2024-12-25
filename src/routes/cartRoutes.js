const express = require('express');
const { createCart, addItemToCart, removeCartItem } = require('../controllers/cartController');


const router = express.Router();


router.route('/carts').post(createCart);

router
    .route('/carts/:id/add-item')
    .patch(addItemToCart)

router
    .route('/carts/:id/remove-item')
    .patch(removeCartItem)



module.exports = router