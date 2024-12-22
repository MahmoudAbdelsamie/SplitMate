const {
  createGroup,
  addGroupMembers,
  removeGroupMember,
} = require("../controllers/groupController");

const router = require("express").Router();

router.route("/groups").post(createGroup);

router.route("/groups/:id/members").post(addGroupMembers);

router.route("/groups/:id/members/:memberId").delete(removeGroupMember);

module.exports = router;
