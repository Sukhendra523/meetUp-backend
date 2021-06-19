const express = require("express");
const {
  addFeature,
  deleteFeature,
  getAllFeatures,
  getFeatureDetails,
  updateFeature,
} = require("../controller/feature");

const router = express.Router();

router.get("/features", getAllFeatures);
router.get("/feature/:id", getFeatureDetails);
router.post("/feature/add", addFeature);
router.put("/feature/update/:id", updateFeature);
router.delete("/feature/delete/:id", deleteFeature);

module.exports = router;
