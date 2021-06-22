const express = require("express");
const { requireSignin } = require("../common-middleware");
const {
  createInitialRole,
  createRole,
  updateRole,
  deleteRole,
  createSuperAdminRole,
  getRoleDetails,
  getAllRole,
} = require("../controller/role");
const router = express.Router();

///////// just for development purpose/////////
router.post("/createInitialRole", createInitialRole);
router.post("/createSuperAdmin", createSuperAdminRole);
////////////////////////////////////////////////////////

router.post("/roles", requireSignin, canWriteRole, getAllRole);
router.post("/role/:id", requireSignin, canWriteRole, getRoleDetails);
router.post("/role/create", requireSignin, canWriteRole, createRole);
router.patch("/role/update/:id", requireSignin, canWriteRole, updateRole);
router.delete("/role/delete/:id", requireSignin, canWriteRole, deleteRole);

module.exports = router;
