const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Token = require("../models/token");
const env = require("dotenv");
const mailgun = require("mailgun-js");
const DOMAIN = "sandboxf74c8ab61afc4c76934293627a5a58c1.mailgun.org";
const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN });
//Environment Variable
env.config();

exports.createUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      const registerToken = jwt.sign({ email, role }, process.env.SECRET_KEY, {
        expiresIn: "1d",
      });
      const { token } = await Token.findOneAndUpdate(
        { token: registerToken },
        { token: registerToken },
        { upsert: true, new: true }
      );
      if (token) {
        let data = {
          from: "ITAIMS info@itaims.com",
          to: email,
          subject: "Register your account",
          html: `<div style="margin: auto;width: 50%;">
          <div style="padding-top:32px;text-align:center">
          <h1><b>ITAIMS requested you to create your new account</b></h1>
          <h3>Please click the link below to create new your account with in 24 hours</h3> 
          <a style="
          line-height: 16px;
          color: #ffffff;
          font-weight: 400;
          text-decoration: none;
          font-size: 14px;
          display: inline-block;
          padding: 10px 24px;
          background-color: #4184f3;
          border-radius: 5px;
          min-width: 90px;" href="${process.env.ClIENT_URL}/register/${token}">Register</a>
          <p>With love,
          <br/>
          <b>The ITAIMS Team</b></p>
          </div></div>`,
        };

        const body = await mg.messages().send(data);
        body &&
          res.status(200).json({
            message: `Email has sent to ${email},now user can register`,
          });
      }
    }
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
