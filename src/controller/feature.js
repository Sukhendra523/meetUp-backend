const Feature = require("../models/feature");

// get all features
exports.getAllFeatures = async (req, res) => {
  try {
    const features = await Feature.find({});
    if (features.length > 0) {
      res.status(200).json(features);
    } else {
      res.status(400).json({
        message: "No featues found",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

// get feature by id
exports.getFeatureDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const feature = await Feature.findById(id);
    if (feature) {
      res.status(200).json(feature);
    } else {
      res.status(400).json({
        message: "Feature not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

// add new feature
exports.createFeature = async (req, res) => {
  try {
    const feature = new Feature(req.body);
    if (feature) {
      const feature = await newFeature.save();
      if (feature) {
        res.status(201).json({
          savedFeature,
          message: "Feature added successfully",
        });
      } else {
        res.status(400).json({
          message: "Unable to Create",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Unable to create Feature",
    });
  }
};

// updating a feature
exports.updateFeature = async (req, res) => {
  try {
    const id = req.params.id;
    const feature = await Feature.findByIdAndUpdate(id, req.body);
    if (feature) {
      res.status(200).json({ feature, message: "Updated successfully" });
    } else {
      res.status(400).json({
        message: "Unable to update",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Unable to update",
    });
  }
};

//Delete feature
exports.deleteFeature = async (req, res) => {
  const id = req.params.id;
  try {
    const feature = await Feature.findByIdAndDelete(id);
    if (feature) {
      res.status(200).json({
        feature,
        message: "feature deleted succssfully",
      });
    } else {
      res.status(400).json({
        message: "Unable to delete",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Unable to delete",
    });
  }
};
