const jwt = require("jsonwebtoken");
const { permissionsConstant } = require("../controller/constant");

exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.SECRET_KEY);
    req.user = user;
  } else {
    return res
      .status(401)
      .json({ status: 401, success: false, message: "Login Required" });
  }
  next();
};

exports.canReadUser = (req, res, next) => {
  if (!req.user.role.permissions.includes(permissionsConstant.READ_USER)) {
    return res
      .status(401)
      .json({ status: 401, success: false, message: " Acces denied" });
  }
  next();
};

exports.canWriteUser = (req, res, next) => {
  if (!req.user.role.permissions.includes(permissionsConstant.WRITE_USER)) {
    return res
      .status(401)
      .json({ status: 401, success: false, message: " Acces denied" });
  }
  next();
};

exports.canWriteRole = (req, res, next) => {
  if (!req.user.role.permissions.includes(permissionsConstant.WRITE_ROLE)) {
    return res
      .status(400)
      .json({ status: 401, success: false, message: " Acces denied" });
  }
  next();
};

exports.canWriteFeature = (req, res, next) => {
  if (!req.user.role.permissions.includes(permissionsConstant.WRITE_FEATURE)) {
    return res
      .status(400)
      .json({ status: 401, success: false, message: " Acces denied" });
  }
  next();
};

exports.canWriteMeeting = (req, res, next) => {
  if (!req.user.role.permissions.includes(permissionsConstant.WRITE_MEETING)) {
    return res
      .status(400)
      .json({ status: 401, success: false, message: " Acces denied" });
  }
  next();
};
exports.canManageMeeting = (req, res, next) => {
  if (!req.user.role.permissions.includes(permissionsConstant.MANAGE_MEETING)) {
    return res
      .status(400)
      .json({ status: 401, success: false, message: " Acces denied" });
  }
  next();
};

exports.canHostMeeting = (req, res, next) => {
  if (!req.user.role.permissions.includes(permissionsConstant.HOST_MEETING)) {
    return res
      .status(400)
      .json({ status: 401, success: false, message: " Acces denied" });
  }
  next();
};
