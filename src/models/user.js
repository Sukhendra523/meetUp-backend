const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: mongoose.Types.ObjectId("60d05573bca4302ac8b87f2b"),
    },
    password: {
      oauthPassword: String,
      userPassword: {
        type: String,
        required: true,
      },
    },
    image: String,
    contact: { type: Number, min: 10 },
  },
  { timestamps: true }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.methods = {
  authenticate: async function (textPassword) {
    return await bcrypt.compare(textPassword, this.password.userPassword);
  },
};

module.exports = mongoose.model("User", userSchema);
