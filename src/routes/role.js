const express = require("express");
const { createInitialRole } = require("../controller/role");
const router = express.Router();
router.post("/createInitialRole", createInitialRole);

module.exports = router;
