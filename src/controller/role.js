const Role = require("../models/role");

exports.createInitialRole = async (req, res) => {
  const initialRole = await new Role({
    name: "user",
    features: [],
    enable: false,
  }).save();
  if (initialRole) {
    res.status(201).json({ initialRole });
  } else {
    res.status(400).json({ error: "not saved" });
  }
};

exports.createRole = async (req, res) => {
  const {name,features,enable}=req.body
  const role = await new Role({
    name,features,enable
  }).save();
  if (role) {
    res.status(201).json({ role });
  } else {
    res.status(400).json({ error: "Unable to create" });
  }
};

exports.updateRole=async(req,res)=>{
  Role.findByIdAndUpdate(req.params.id,req.body, (err,Role)=>{
    if (err) {
      return res.status(500).send({error: "Problem with Updating the Role"})
    };
    res.send({success: "Updation successfull"});
  })
}  

exports.deleteRole=async(req,res)=>{
  Role.findByIdAndUpdate(req.params.id,req.body, (err,Role)=>{
    if (err) {
      return res.status(500).send({error: "Problem with Updating the Role"})
    };
    res.send({success: "Deletion successfull"});
  })
}  