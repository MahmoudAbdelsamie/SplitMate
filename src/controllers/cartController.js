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






module.exports = {
    createCart
}