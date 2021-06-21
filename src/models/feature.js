const mongoose = require("mongoose");
const featureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  enable: {
    type: Boolean,
    default: true,
  },
  privacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
});

module.exports = mongoose.model("Feature", featureSchema);
