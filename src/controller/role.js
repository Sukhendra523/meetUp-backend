const Role = require("../models/role");
const { All_PERMISSIONS } = require("./constant");

//////////////just for development purpose////////////
exports.createInitialRole = async (req, res) => {
  const initialRole = await new Role({
    name: "user",
  }).save();
  if (initialRole) {
    res.status(201).json({ status: 201, success: true, initialRole });
  } else {
    res.status(501).json({ status: 501, success: false, message: "not saved" });
  }
};
///////////////////////////////////////////////////
/////////////just for development purpose//////////
exports.createSuperAdminRole = async (req, res) => {
  const SuperAdminRole = await new Role({
    name: "Super user",
    permissions: All_PERMISSIONS,
    enable: true,
  }).save();
  if (SuperAdminRole) {
    res.status(201).json({ status: 201, success: true, SuperAdminRole });
  } else {
    res.status(501).json({ status: 501, success: false, message: "not saved" });
  }
};
////////////////////////////////////////////////////

exports.getAllRole = async (req, res) => {
  try {
    const roles = await Role.find();
    if (roles) {
      res.status(200).json({ status: 200, success: true, roles });
    } else {
      res
        .status(404)
        .json({ status: 404, success: false, message: "No roles Found" });
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

exports.getRoleDetails = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (role) {
      res.status(200).json({ status: 200, success: true, role });
    } else {
      res
        .status(404)
        .json({ status: 404, success: false, message: "No role Found" });
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

exports.createRole = async (req, res) => {
  try {
    const { name, permissions, enable } = req.body;
    const role = await new Role({
      name,
      permissions,
      enable,
    }).save();
    if (role) {
      res.status(201).json({ status: 201, success: true, role });
    } else {
      res
        .status(501)
        .json({ status: 501, success: false, message: "Unable to create" });
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

exports.updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (role) {
      res
        .status(200)
        .json({ status: 200, success: true, message: "Updation successfull" });
    } else {
      res
        .status(501)
        .json({ status: 501, success: false, message: "Unable to update" });
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

exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndRemove(req.params.id);
    if (role) {
      res
        .status(200)
        .json({ status: 200, success: true, message: "Deleted Successfully" });
    } else {
      res
        .status(501)
        .json({ status: 501, success: false, message: "Unable to delete" });
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
