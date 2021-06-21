const jwt = require("jsonwebtoken");
const { permissionsConstant } = require("../controller/constant");

exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.SECRET_KEY);
    req.user = user;
  } else {
    return res.status(400).json({ message: "Signin required" });
  }
  next();
};

exports.canReadUser = (req, res, next) => {
  if (!req.user.role.permissions.includes(permissionsConstant.READ_USER)) {
    return res.status(400).json({ message: " Acces denied" });
  }
  next();
};

exports.canWriteUser = (req, res, next) => {
  if (!req.user.role.permissions.includes(permissionsConstant.WRITE_USER)) {
    return res.status(400).json({ message: " Acces denied" });
  }
  next();
};
