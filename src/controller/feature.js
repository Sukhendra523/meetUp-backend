const Feature = require("../models/feature");

// add new feature
exports.createFeature = async (req, res) => {
  try {
    const { name, key, privacy, settings, enable } = req.body;
    const newfeature = new Feature({ name, key, privacy, settings, enable });
    const feature = await newfeature.save();
    if (feature) {
      res.status(201).json({
        status: 201,
        success: true,
        feature,
        message: "Feature added successfully",
      });
    } else {
      res.status(501).json({
        status: 501,
        success: false,
        message: "Unable to Create",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      error: error.message,
      message: "Unable to create Feature",
    });
  }
};

// get all features
exports.getAllFeatures = async (req, res) => {
  try {
    const features = await Feature.find({});
    if (features.length > 0) {
      res.status(200).json({ status: 200, success: true, features });
    } else {
      res.status(404).json({
        status: 404,
        success: false,
        message: "No featues found",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
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
      res.status(200).json({ status: 200, success: true, feature });
    } else {
      res.status(404).json({
        status: 404,
        success: false,
        message: "Feature not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

// updating a feature
exports.updateFeature = async (req, res) => {
  try {
    const feature = await Feature.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (feature) {
      res.status(200).json({
        status: 200,
        success: true,
        feature,
        message: "Updated successfully",
      });
    } else {
      res.status(501).json({
        status: 501,
        success: false,
        message: "Unable to update",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
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
        status: 200,
        success: true,
        feature,
        message: "feature deleted succssfully",
      });
    } else {
      res.status(501).json({
        status: 501,
        success: false,
        message: "Unable to delete",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      error: error.message,
      message: "Unable to delete",
    });
  }
};
