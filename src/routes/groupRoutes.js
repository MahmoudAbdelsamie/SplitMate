const express = require("express");
const { createGroup, addGroupMembers, removeGroupMember } = require("../controllers/groupController");

const router = express.Router();

// Define routes
router.post("/groups", createGroup);
router.post("/groups/:id/members", addGroupMembers);
router.delete("/groups/:id/members/:memberId", removeGroupMember);

module.exports = router;