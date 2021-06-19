const express = require("express");
const { createInitialRole,createRole,updateRole,deleteRole } = require("../controller/role");
const router = express.Router();

router.post("/createInitialRole", createInitialRole);
router.post("/role/create",createRole);
router.patch("/role/updateRole/:id",updateRole);
router.delete("/role/deleteRole/:id",deleteRole);


module.exports = router;
