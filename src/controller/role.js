const Role = require("../models/role");

exports.createInitialRole = async (req, res) => {
  const initialRole = await new Role({
    name: "user",
  }).save();
  if (initialRole) {
    res.status(201).json({ initialRole });
  } else {
    res.status(400).json({ message: "not saved" });
  }
};

exports.createRole = async (req, res) => {
  const { name, permissions, enable } = req.body;
  const role = await new Role({
    name,
    permissions,
    enable,
  }).save();
  if (role) {
    res.status(201).json({ role });
  } else {
    res.status(400).json({ message: "Unable to create" });
  }
};

exports.updateRole = async (req, res) => {
  Role.findByIdAndUpdate(req.params.id, req.body, (err, Role) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Problem with Updating the Role" });
    }
    res.send({ message: "Updation successfull" });
  });
};

exports.deleteRole = async (req, res) => {
  Role.findByIdAndUpdate(req.params.id, req.body, (err, Role) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Problem with Updating the Role" });
    }
    res.send({ message: "Deletion successfull" });
  });
};
