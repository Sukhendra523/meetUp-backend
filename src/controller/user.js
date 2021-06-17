const User = require("../models/user");

exports.getUserProfile = (req, res) => {
  User.findById(req.params.id, { image: 1, _id: 0 }, (error, doc) => {
    if (error) return res.status(400).json(error);
    if (doc) {
      const { image } = doc;
      res.status(200).json({ image });
    } else {
      res
        .status(400)
        .json({ message: "Something Goes wrong Try Again latter" });
    }
  });
};
