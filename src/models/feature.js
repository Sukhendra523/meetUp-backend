const mongoose = require("mongoose");
const featureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
    unique: true,
  },
  privacy: [
    {
      key: String,
      enable: {
        type: Boolean,
        default: true,
      },
    },
  ],
  settings: [
    {
      key: String,
      enable: {
        type: Boolean,
        default: true,
      },
    },
  ],
  enable: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Feature", featureSchema);
