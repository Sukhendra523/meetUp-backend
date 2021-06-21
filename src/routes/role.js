const express = require("express");
const {
  createInitialRole,
  createRole,
  updateRole,
  deleteRole,
  createSuperAdminRole,
} = require("../controller/role");
const router = express.Router();

// just for development purpose
router.post("/createInitialRole", createInitialRole);
router.post("/createSuperAdmin", createSuperAdminRole);

router.post("/role/create", createRole);
router.patch("/role/updateRole/:id", updateRole);
router.delete("/role/deleteRole/:id", deleteRole);

module.exports = router;
