const jwt = require("jsonwebtoken");

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

exports.isStudent = (req, res, next) => {
  if (req.user.role == "student") {
    return res.status(400).json({ message: "Student Acces denied" });
  }
  next();
};

exports.isTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(400).json({ message: "Teacher Acces denied" });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(400).json({ message: " Admin Acces denied" });
  }
  next();
};
