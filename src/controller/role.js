const Role = require("../models/role");

exports.createInitialRole = async (req, res) => {
  const initialRole = await new Role({
    name: "user",
    features: [],
    enable: false,
  }).save();
  if (initialRole) {
    res.status(201).json({ initialRole });
  } else {
    res.status(400).json({ error: "not saved" });
  }
};
