const mongoose = require("mongoose");
const featureSchema = new mongoose.Schema(
  {
    name: String,
    enable: boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("feature", featureSchema);
