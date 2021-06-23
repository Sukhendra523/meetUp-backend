const express = require("express");
const { requireSignin, canWriteRole } = require("../common-middleware");
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

router.all("/", requireSignin, canWriteRole);

router.post("/roles", getAllRole);
router.post("/role/:id", getRoleDetails);
router.post("/role/create", createRole);
router.patch("/role/update/:id", updateRole);
router.delete("/role/delete/:id", deleteRole);

module.exports = router;
