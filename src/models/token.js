const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: { type: String, required: true },
    expire: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);
