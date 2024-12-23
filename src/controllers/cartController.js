require('dotenv').config()
const prisma = require('../config/database');


// Create a new cart --> POST /carts
const createCart = async (req, res) => {
    const { groupId, userId } = req.body;
    try {
        const group = await prisma.group.findUnique({ where: { id: groupId } });
        if (!group) {
            return res.status(404).json({
                error: 'Group not found',
            });
        }

        const cart = await prisma.cart.create({
            data: {
                groupId,
                userId, 
            },
        });

        return res.status(201).json({
            message: 'Cart Created Successfully',
            cart,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err.message,
        });
    }
};


// Add Item to Cart --> patch('/carts/:id/add-item')
const addItemToCart = async (req, res) => {
    const { id } = req.params;
    const { productId, quantity } = req.body;
    try {
        const cart = await prisma.cart.findUnique({ where: { id: parseInt(id) } });
        if(!cart) {
            return res.status(404).json({ error: 'Cart Not Found!'})
        }
        const product = await prisma.product.findUnique({
            where: {
                id: productId
            }
        })
        if(!product) {
            return res.status(404).json({
                error: 'product not found!'
            })
        }
        const cartItem = await prisma.cartItem.upsert({
            where: {
                cartId_productId: {
                    cartId: parseInt(id),
                    productId,
                },
            },
            update: {
                quantity: { increment: quantity },
            },
            create: {
                cartId: parseInt(id),
                productId,
                quantity,
            },
        });
        res.json({
            message: 'Item Added to cart',
            cartItem
        })
    } catch(err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        })
    }
}






module.exports = {
    createCart,
    addItemToCart
}