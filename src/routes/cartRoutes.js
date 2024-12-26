const express = require('express');
const { createCart, addItemToCart, removeCartItem, removeCart } = require('../controllers/cartController');


const router = express.Router();


router.route('/carts').post(createCart);

router
    .route('/carts/:id/add-item')
    .patch(addItemToCart)

router
    .route('/carts/:id/remove-item')
    .patch(removeCartItem)


router
    .route('/carts/:id')
    .delete(removeCart)

module.exports = router