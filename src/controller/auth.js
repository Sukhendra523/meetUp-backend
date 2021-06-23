const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Token = require("../models/token");
const env = require("dotenv");
const mailgun = require("mailgun-js");
const DOMAIN = "sandboxf74c8ab61afc4c76934293627a5a58c1.mailgun.org";
const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN });
const fetch = require("node-fetch");

//Environment Variable
env.config();

exports.facebookSignin = async (req, res) => {
  const { userId, accessToken } = req.body;
  try {
    let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userId}/?fields=id,name,username,email&access_token=${accessToken}`;
    const { email, username } = await (
      await fetch(urlGraphFacebook, { method: "GET" })
    ).json();
    const user = await User.findOne(email).populate(
      "role",
      "_id name permissions enable"
    );
    if (user) {
      const token = jwt.sign(
        { email: user.email, _id: user._id, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: "1d" }
      );
      res.status(200).json({ token, user });
    } else {
      const password = email + process.env.SECRET_KEY;
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        username,
        password: { oauthPassword: hashPassword, userPassword: hashPassword },
      });
      const user = await (await newUser.save())
        .populate("role", "_id name permissions enable")
        .execPopulate();
      if (user) {
        const token = jwt.sign(
          { email: user.email, _id: user._id, role: user.role },
          process.env.SECRET_KEY,
          { expiresIn: "1d" }
        );
        res.status(200).json({ token, user });
      }
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.signup = async (req, res) => {
  const { email, username, contact, password } = req.body;
  try {
    const emailExits = await User.findOne({ email: email }, "email");
    const usernameExits = await User.findOne(
      { username: username },
      "username"
    );

    if (emailExits || usernameExits) {
      return res.status(400).json({
        message:
          "This " + (emailExits ? "email" : "username") + " already Exists",
      });
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        username,
        contact,
        password: { oauthPassword: "", userPassword: hashPassword },
      });

      const user = await (await newUser.save())
        .populate("role", "_id name permissions enable")
        .execPopulate();

      if (user) {
        const token = jwt.sign(
          { email: user.email, _id: user._id, role: user.role },
          process.env.SECRET_KEY,
          { expiresIn: "1d" }
        );

        let data = {
          from: "Sukhendra Rajawat contact.sukhendra@gmail.com",
          to: user.email,
          subject: "Activate your account",
          html: `<div style="margin: auto;width: 50%;">
            <div style="padding-top:32px;text-align:center">
            <h1><b>Activate your account</b></h1>
            <h3>Please click the link below to activate your account</h3> 
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
            min-width: 90px;" href="${process.env.ClIENT_URL}/activate/${token}">Activate Account</a></div></div>`,
        };

        const body = await mg.messages().send(data);
        body
          ? res.status(200).json({
              message: "Email has sent, kindly activate your Account",
              token,
              user,
            })
          : res.status(200).json({
              message:
                "Unable to send Email to verify Account, kindly activate your Account",
              token,
              user,
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

exports.activateAccount = async (req, res) => {
  const { token } = req.body;
  if (token) {
    const user = jwt.verify(token, process.env.SECRET_KEY);
    if (user) {
      res.status(200).json({ message: "Accounted Activated Successfully " });
    } else {
      return res.status(400).json({ message: "Incorrect or  Expired Link ." });
    }
  }
};

exports.signin = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    }).populate("role", "_id name permissions enable");

    if (user) {
      if (user.authenticate(password)) {
        const token = jwt.sign(
          { email: user.email, _id: user._id, role: user.role },
          process.env.SECRET_KEY,
          { expiresIn: "1d" }
        );
        res.status(200).json({ token, user });
      } else {
        res.status(400).json({ message: "Incorrect Password" });
      }
    } else {
      return res.status(400).json({ message: "Incorrect Password or Id" });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "No user found with that email address." });
    }
    const resetToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "20min",
    });
    const { token } = await Token.findOneAndUpdate(
      { userId: user._id },
      { userId: user._id, token: resetToken },
      { upsert: true, new: true }
    );

    if (token) {
      let data = {
        from: "Sukhendra Rajawat contact.sukhendra@gmail.com",
        to: user.email,
        subject: "Reset your password",
        html: `<div style="margin: auto;width: 50%;">
        <div style="padding-top:32px;text-align:center">
        <h1><b>Reset your password</b></h1>
        <h3>Please click the link below to reset your password</h3> 
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
        min-width: 90px;" href="${process.env.ClIENT_URL}/reset-password/${token}">Reset password</a></div></div>`,
      };

      const body = await mg.messages().send(data);
      body &&
        res.status(200).json({
          message: "Email has sent,kindly follow the instruction",
        });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const { _id } = jwt.verify(token, process.env.SECRET_KEY);
    if (!_id) {
      throw new Error("Invalid or expired password reset token");
    }
    let resetToken = await Token.findOne({ userId: _id });

    if (!resetToken) {
      throw new Error("Invalid or expired password reset token");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { _id: _id },
      { password: hashPassword },
      { new: true }
    );
    if (user) {
      let data = {
        from: "Sukhendra Rajawat contact.sukhendra@gmail.com",
        to: user.email,
        subject: "Your password has changed",
        html: `<div style="margin: auto;width: 50%;">
      <div style="padding-top:32px;text-align:center">
      <h1><b>Your account password has changed</b></h1>
      <h3>Hi ${user.firstName ? user.firstName : "user"}</h3>
      <p>We’re confirming that you changed your ITAIMS account password for ${
        user.email
      }.</p>
      <p>If you did not reset this password, please contact ITAIMS support immediately at info@itaims.com.
      </p> 
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
      min-width: 90px;" href="${process.env.ClIENT_URL}/contact">Contact</a>
      <p>With love,
      <br/>
      The ITAIMS Team</p>
      </div></div>`,
      };

      const body = await mg.messages().send(data);
      body &&
        res.status(200).json({
          message: "Password has Changed successfully",
        });
    } else {
      return throwFailed(error, "Unable to send email.");
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};
