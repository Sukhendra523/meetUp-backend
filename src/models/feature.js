const mongoose = require("mongoose");
const featureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  enable: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("Feature", featureSchema);
