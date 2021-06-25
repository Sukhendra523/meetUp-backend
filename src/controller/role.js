const Role = require("../models/role");
const { All_PERMISSIONS } = require("./constant");

//////////////just for development purpose////////////
exports.createInitialRole = async (req, res) => {
  const initialRole = await new Role({
    name: "user",
  }).save();
  if (initialRole) {
    res.status(201).json(initialRole);
  } else {
    res.status(400).json({ message: "not saved" });
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
    res.status(201).json(SuperAdminRole);
  } else {
    res.status(400).json({ message: "not saved" });
  }
};
////////////////////////////////////////////////////

exports.getAllRole = async (req, res) => {
  try {
    const roles = await Role.find();
    if (roles) {
      res.status(200).json(roles);
    } else {
      res.status(400).json({ message: "No roles Found" });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.getRoleDetails = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (role) {
      res.status(201).json(role);
    } else {
      res.status(400).json({ message: "No role Found" });
    }
  } catch (error) {
    res.status(400).json({
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
      res.status(201).json(role);
    } else {
      res.status(400).json({ message: "Unable to create" });
    }
  } catch (error) {
    res.status(400).json({
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
      res.status(201).json({ message: "Updation successfull" });
    } else {
      res.status(400).json({ message: "Unable to update" });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndRemove(req.params.id);
    if (role) {
      res.status(200).json({ message: "Deleted Successfully" });
    } else {
      res.status(400).json({ message: "Unable to delete" });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};
