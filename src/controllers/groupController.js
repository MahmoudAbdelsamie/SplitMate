require('dotenv').config();
const prisma = require('../config/database');

// Create a new group --> POST /groups
const createGroup = async (req, res) => {
    const { name, userIds, createdById } = req.body; 

    try {
        const creator = await prisma.user.findUnique({ where: { id: createdById } });
        if (!creator) {
            return res.status(400).json({
                error: 'Creator user does not exist' 
            });
        }

        const users = await prisma.user.findMany({
            where: {
                id: {
                    in: userIds 
                } 
            } 
        });
        if (users.length !== userIds.length) {
            return res.status(400).json({
                error: 'Some users do not exist' 
            });
        }

        const group = await prisma.group.create({
            data: {
                name,
                createdById, // Assign the creator
                members: {
                    create: userIds.map((userId) => ({ userId })),
                },
            },
            include: {
                members: true,
            },
        });

        res.status(201).json({
            message: 'Group created successfully',
            group 
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error!',
            error: err.message 
        });
    }
};






module.exports = {
    createGroup,


}