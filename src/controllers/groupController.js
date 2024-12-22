require("dotenv").config();
const prisma = require("../config/database");

// Helper function to find users by IDs
const findUsersByIds = async (userIds) => {
  return prisma.user.findMany({
    where: {
      id: { in: userIds },
    },
  });
};

// Helper function to find a group by ID
const findGroupById = async (id) => {
  return prisma.group.findUnique({
    where: { id: parseInt(id) },
  });
};

// Create a new group --> POST /groups
const createGroup = async (req, res) => {
  const { name, userIds, createdById } = req.body;

  try {
    const [creator, users] = await Promise.all([
      prisma.user.findUnique({ where: { id: createdById } }),
      findUsersByIds(userIds),
    ]);

    if (!creator) {
      return res.status(400).json({ error: "Creator user does not exist" });
    }

    if (users.length !== userIds.length) {
      return res.status(400).json({ error: "Some users do not exist" });
    }

    const group = await prisma.group.create({
      data: {
        name,
        createdById,
        members: { create: userIds.map((userId) => ({ userId })) },
      },
      include: { members: true },
    });

    res.status(201).json({ message: "Group created successfully", group });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error!", error: err.message });
  }
};

// Adding members to a group --> POST /groups/:id/members
const addGroupMembers = async (req, res) => {
  const { id } = req.params;
  const { userIds } = req.body;

  try {
    const [group, users] = await Promise.all([
      findGroupById(id),
      findUsersByIds(userIds),
    ]);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (users.length !== userIds.length) {
      return res.status(400).json({ error: "Some users do not exist" });
    }

    const groupMembers = await prisma.groupMember.createMany({
      data: userIds.map((userId) => ({ groupId: parseInt(id), userId })),
      skipDuplicates: true,
    });

    res.status(201).json({ message: "Members added successfully", groupMembers });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
};

// Remove a member from a group --> DELETE /groups/:id/members/:memberId
const removeGroupMember = async (req, res) => {
  const { id, memberId } = req.params;

  try {
    const group = await findGroupById(id);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const deletedMember = await prisma.groupMember.delete({
      where: {
        groupId_userId: {
          groupId: parseInt(id),
          userId: parseInt(memberId),
        },
      },
    });

    res.json({ message: "Member removed successfully", deletedMember });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Member not found in the group" });
    }
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

module.exports = {
  createGroup,
  addGroupMembers,
  removeGroupMember,
};