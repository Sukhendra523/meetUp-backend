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
      return res
        .status(403)
        .json({ status: 403, success: false, message: "User already exists" });
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
            status: 200,
            success: true,
            message: `Email has sent to ${email},now user can register`,
          });
      }
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

// getALLUser
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "_id email username fullname firstName lastName conatct image role"
    ).populate("role", "_id name permissions enable");
    if (users.length > 0) {
      res.status(200).json({ status: 200, success: true, users: users });
    } else {
      res
        .status(404)
        .json({ status: 404, success: false, message: `No User Found` });
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

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id,
      "_id email username fullname firstName lastName conatct image role"
    ).populate("role", "_id name permissions enable");
    if (user) {
      res.status(200).json({ status: 200, success: true, user });
    } else {
      res
        .status(404)
        .json({ status: 404, success: false, message: "No user Found" });
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

exports.getUserProfile = async (req, res) => {
  try {
    const { image } = await User.findById(
      req.params.id,
      { image: 1, _id: 0 },
      { new: true }
    );
    if (image) {
      res.status(200).json({
        status: 200,
        success: true,
        image,
        message: "Profile image updated",
      });
    } else {
      res.status(501).json({
        status: 501,
        success: false,
        message: "Something Goes wrong Try Again latter",
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

exports.searchUserEmails = async (req, res) => {
  const emails = await User.find(
    { email: { $regex: req.params.query } },
    "email"
  );
  try {
    if (emails) {
      res.status(200).json({ status: 200, success: true, emails });
    } else {
      res
        .status(404)
        .json({ status: 404, success: false, message: `no emails found` });
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

exports.searchUser = async (req, res) => {
  try {
    const users = await User.find(
      {
        $or: [
          { email: { $regex: req.params.query } },
          { firstName: { $regex: req.params.query } },
          { username: { $regex: req.params.query } },
        ],
      },
      "_id email username fullname firstName lastName conatct image role"
    ).populate("role", "_id name permissions enable");
    // users.filter(({email,firstName,username,role:{name}})=>())
    if (users) {
      res.status(200).json({ status: 200, success: true, users });
    } else {
      res.status(404).json({
        status: 404,
        success: false,
        message: `Sorry !! No user found`,
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

exports.updateUserProfile = (req, res) => {
  console.log(req.file);
  const image = process.env.API + "/uploads/images/" + req.file.filename;
  User.findByIdAndUpdate(
    req.params.id,
    { image: image },
    { new: true },
    (error, user) => {
      if (error)
        return res.status(400).json({ status: 400, success: false, error });
      if (user) {
        res.status(200).json({
          status: 200,
          success: true,
          message: "User Profile Updated Successfully",
        });
      } else {
        res.status(501).json({
          status: 501,
          success: false,
          message: "Something Goes wrong Try Again latter",
        });
      }
    }
  );
};

exports.updateUser = (req, res) => {
  const { firstName, lastName, username, email, role, contact } = req.body;

  User.findByIdAndUpdate(
    req.params.id,
    { firstName, lastName, username, email, contact, role },
    { new: true },
    (error, user) => {
      if (error)
        return res.status(400).json({ status: 400, success: false, error });
      if (user) {
        res.status(200).json({
          status: 200,
          success: true,
          message: "Updated Successfully",
        });
      } else {
        res.status(501).json({
          status: 501,
          success: false,
          message: "Something Goes wrong Try Again latter",
        });
      }
    }
  );
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (user) {
      res
        .status(200)
        .json({ status: 200, success: true, message: "Deleted Successfully" });
    } else {
      res.status(501).json({
        status: 501,
        success: false,
        message: "Something Goes wrong Try Again latter",
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
