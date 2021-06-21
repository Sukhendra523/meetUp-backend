const Feature = require("../models/feature");

// get all features
exports.getAllFeatures = async (req, res) => {
  try {
    const features = await Feature.find({});
    if (features.length > 0) {
      res.status(200).json({
        features,
      });
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
      res.status(200).json({
        feature,
      });
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
exports.addFeature = async (req, res) => {
  try {
    const newFeature = new Feature(req.body);
    if (newFeature) {
      const savedFeature = await newFeature.save();
      if (savedFeature) {
        res.status(201).json({
          savedFeature,
          message: "Feature added successfully",
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
  const id = req.params.id;
  try {
    const feature = await Feature.findByIdAndUpdate(id, req.body);
    if (feature) {
      res.status(200).json({ message: "Updated successfully" });
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
    const myFeature = await Feature.findByIdAndDelete(id);
    if (myFeature) {
      res.status(200).json({
        myFeature,
        message: "feature deleted succssfully",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Unable to delete",
    });
  }
};
