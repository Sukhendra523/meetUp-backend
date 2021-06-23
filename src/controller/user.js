const User = require("../models/user");

exports.createUser = async (req, res) => {
  try {
    const newUser = new User({
      email,
      role,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

// getALLUser
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(400).json({ message: `No User Found` });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "No user Found" });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const { image } = await User.findById(req.params.id, { image: 1, _id: 0 });
    if (image) {
      res.status(200).json(image);
    } else {
      res
        .status(400)
        .json({ message: "Something Goes wrong Try Again latter" });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.searchUserEmails = async (req, res) => {
  const emails = await User.find(
    { email: { $regex: req.params.input } },
    "email"
  );
  try {
    if (emails) {
      res.status(200).json(emails);
    } else {
      res.status(400).json({ message: `no emails found` });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.searchUser = async (req, res) => {
  try {
    const users = await User.find(
      {
        $or: [
          { email: { $regex: req.params.input } },
          { firstName: { $regex: req.params.input } },
          { userName: { $regex: req.params.input } },
        ],
      },
      "firstName lastName username email role"
    );
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(400).json({ message: `no emails found` });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.updateUser = (req, res) => {
  const { firstName, lastName, username, email } = req.body;
  let user = {};
  if (req.file) {
    user.image = process.env.API + "/uploads/images/" + req.file.filename;
  } else {
    user = {
      firstName,
      lastName,
      username,
      email,
    };
  }
  User.findByIdAndUpdate(req.params.id, user, { new: true }, (error, user) => {
    if (error) return res.status(400).json(error);
    if (user) {
      res.status(200).json({ message: "Updated Successfully", user });
    } else {
      res
        .status(400)
        .json({ message: "Something Goes wrong Try Again latter" });
    }
  });
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (user) {
      res.status(200).json({ message: "Deleted Successfully" });
    } else {
      res
        .status(400)
        .json({ message: "Something Goes wrong Try Again latter" });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};
