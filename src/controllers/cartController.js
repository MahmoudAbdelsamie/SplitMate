require('dotenv').config();
const { group, cart, product, cartItem } = require('../config/database');

// Create a new cart --> POST /carts
const createCart = async (req, res) => {
    const { groupId, userId } = req.body;

    if (!groupId || !userId) {
        return res.status(400).json({ error: 'GroupId and UserId are required' });
    }

    try {
        const foundGroup = await group.findUnique({ where: { id: groupId } });
        if (!foundGroup) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const newCart = await cart.create({
            data: {
                groupId,
                userId,
            },
        });

        return res.status(201).json({
            message: 'Cart Created Successfully',
            cart: newCart,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err.message,
        });
    }
};

// Add Item to Cart --> PATCH /carts/:id/add-item
const addItemToCart = async (req, res) => {
    const { id } = req.params;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ error: 'ProductId and Quantity are required' });
    }

    try {
        const foundCart = await cart.findUnique({ where: { id: parseInt(id) } });
        if (!foundCart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const foundProduct = await product.findUnique({ where: { id: productId } });
        if (!foundProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const updatedCartItem = await cartItem.upsert({
            where: { cartId_productId: { cartId: parseInt(id), productId } },
            update: { quantity: { increment: quantity } },
            create: { cartId: parseInt(id), productId, quantity },
        });

        return res.json({
            message: 'Item Added to cart',
            cartItem: updatedCartItem,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err.message,
        });
    }
};

module.exports = {
    createCart,
    addItemToCart,
};