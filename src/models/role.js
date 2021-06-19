const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    features: [
      {
        feature: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Feature",
          required: true,
        },
      },
    ],
    enable: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
