const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema(
  {
    name: String,
    features: [String],
    enable: boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
