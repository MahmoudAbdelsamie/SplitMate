require('dotenv').config();
const prisma = require('../config/database');
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

// Remove Cart Item --> '/carts/:id/remove-item'
const removeCartItem = async (req, res) => {
    const { id } = req.params;
    const { productId, quantity } = req.body;
    try {
        const cart = await prisma.cart.findUnique({ where: { id: parseInt(id) } });
        if(!cart) {
            return res.status(404).json({ error: 'Cart Not Found'});
        }

        const cartItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: parseInt(id),
                    productId,
                },
            },
        });
        if(!cartItem) {
            return res.status(404).json({ error: 'Item not found in the cart'})
        }
        if(cartItem.quantity > quantity) {
            const updatedCartItem = await prisma.cartItem.update({
                where: {
                    cartId_productId: {
                        cartId: parseInt(id),
                        productId,
                    },
                },
                data: {
                    quantity: { decrement: quantity },
                },
            });
            res.json({ message: 'Item quantity updated', updatedCartItem });
        } else {
            await prisma.cartItem.delete({
                where: {
                    cartId_productId: {
                        cartId: parseInt(id),
                        productId,
                    },
                },
            });
            res.json({ message: 'Item removed from cart'});
        }
    } catch(err){
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        })
    }
}


// Remove cart  --> DELETE /carts/:id

const removeCart = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.cart.delete({
            where: {
                id: parseInt(id)
            }
        });
        return res.json({
            message: 'Cart Deleted Successfully!'
        })
    } catch(err) {
        if(err.code === 'P2025') {
            return res.status(404).json({
                error: 'Cart Not Found!'
            })
        }
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        })
    }

}


// DELETE /carts/:id - Clear a cart
// app.delete('/carts/:id', async (req, res) => {
//     const { id } = req.params; // Cart ID
//     try {
//         // Validate that the cart exists
//         const cart = await prisma.cart.findUnique({ where: { id: parseInt(id) } });
//         if (!cart) {
//             return res.status(404).json({ error: 'Cart not found' });
//         }

//         // Delete all items in the cart
//         await prisma.cartItem.deleteMany({ where: { cartId: parseInt(id) } });

//         // Delete the cart
//         await prisma.cart.delete({ where: { id: parseInt(id) } });

//         res.json({ message: 'Cart cleared successfully' });
//     } catch (err) {
//         res.status(500).json({ error: 'Something went wrong', details: err.message });
//     }
// });


module.exports = {
    createCart,
    addItemToCart,
    removeCartItem,
    removeCart,
    

};