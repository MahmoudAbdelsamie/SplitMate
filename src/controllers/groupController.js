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



// Adding members to a group --> POST /groups/:id/members
const addGroupMembers = async (req, res) => {
    const { id } = req.params; 
    const { userIds } = req.body; 
    try {
        const group = await prisma.group.findUnique({ where: { id: parseInt(id) } });
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const users = await prisma.user.findMany({ where: { id: { in: userIds } } });
        if (users.length !== userIds.length) {
            return res.status(400).json({ error: 'Some users do not exist' });
        }

        const groupMembers = await prisma.groupMember.createMany({
            data: userIds.map((userId) => ({ groupId: parseInt(id), userId })),
            skipDuplicates: true, // Avoid adding duplicate members
        });

        res.status(201).json({ message: 'Members added successfully', groupMembers });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong', details: err.message });
    }
};





module.exports = {
    createGroup,
    addGroupMembers,

}