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

router.use("/", requireSignin, canWriteRole);

router.get("/roles", getAllRole);
router.post("/role/create", createRole);
router.put("/role/update/:id", updateRole);
router.delete("/role/delete/:id", deleteRole);
router.get("/role/:id", getRoleDetails);

module.exports = router;
