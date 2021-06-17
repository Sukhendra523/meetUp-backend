const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema(
  {
    name: String,
    features: [String],
    enable: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
