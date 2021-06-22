const express = require("express");
const { requireSignin } = require("../common-middleware");
const {
  createFeature,
  deleteFeature,
  getAllFeatures,
  getFeatureDetails,
  updateFeature,
} = require("../controller/feature");

const router = express.Router();

router.get("/features", requireSignin, canWriteFeature, getAllFeatures);
router.get("/feature/:id", requireSignin, canWriteFeature, getFeatureDetails);
router.post("/feature/create", requireSignin, canWriteFeature, createFeature);
router.put(
  "/feature/update/:id",
  requireSignin,
  canWriteFeature,
  updateFeature
);
router.delete(
  "/feature/delete/:id",
  requireSignin,
  canWriteFeature,
  deleteFeature
);

module.exports = router;
