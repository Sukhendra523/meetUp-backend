const mongoose = require("mongoose");
const featureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  key: [{ type: String, required: true, unique: true }],
  enable: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Feature", featureSchema);
