const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      min: 3,
      max: 20,
    },
    lastName: {
      type: String,
      trim: true,
      min: 3,
      max: 20,
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
      default: mongoose.Types.ObjectId("60cba03e750ed21cb81919bc"),
    },
    password: {
      type: String,
      required: true,
    },
    image: String,
    contact: Number,
  },
  { timestamps: true }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.methods = {
  authenticate: async function (textPassword) {
    return await bcrypt.compare(textPassword, this.password);
  },
};

module.exports = mongoose.model("User", userSchema);
