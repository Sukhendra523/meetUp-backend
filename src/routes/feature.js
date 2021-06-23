const express = require("express");
const { requireSignin, canWriteFeature } = require("../common-middleware");
const {
  createFeature,
  deleteFeature,
  getAllFeatures,
  getFeatureDetails,
  updateFeature,
} = require("../controller/feature");

const router = express.Router();

router.use("/", requireSignin, canWriteFeature);

router.post("/feature/create", createFeature);
router.get("/features", getAllFeatures);
router.get("/feature/:id", getFeatureDetails);
router.put("/feature/update/:id", updateFeature);
router.delete("/feature/delete/:id", deleteFeature);

module.exports = router;
