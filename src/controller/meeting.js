const Meeting = require("../models/meeting");
// import endOfDayfrom 'date-fns/endOfDay'
// import startOfDay from 'date-fns/startOfDay'
const env = require("dotenv");

//Environment Variable
env.config();

exports.createMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ roomName: req.body.roomName });
    if (meeting) {
      console.log("roomName already exits");
      return res.status(400).json({ message: "roomName already exits" });
    } else {
      const {
        roomName,
        title,
        description,
        attendees,
        // schedule,
        createdBy,
        features,
      } = req.body;
      // let start = schedule.start;
      // let end = schedule.end;
      //////////// For Development Purpose////////////////////
      const d = new Date();
      console.log("d", d);
      let start = new Date();
      console.log("start", start);
      let [month, date, year] = start.toLocaleDateString("en-IN").split("/");
      let [hour] = start.toLocaleTimeString("en-US").split(/:| /);
      console.log("month, date, year, hour", month, date, year, hour);
      let end = new Date(year, month, date, parseInt(hour) + 2, 0, 0);
      console.log("end", end);

      /////////////////////////////////////////////////////
      let scheduleDate = {
        start,
        end,
      };
      const meeting = await new Meeting({
        roomName,
        title,
        description,
        attendees,
        schedule: scheduleDate,
        createdBy,
        features,
      }).save();
      meeting &&
        res
          .status(201)
          .json({ message: `Meeting created successfully`, meeting });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.getAllMeeting = async (req, res) => {
  try {
    // let start = new Date(req.params.meetingDate);
    // console.log("Start:::::::::::::::", start);
    const meetings = await Meeting.find()
      .populate("createdBy", "fullName username email image")
      .populate("attendees", "fullName username email image");
    meetings.length > 0
      ? res.status(200).json(meetings)
      : res.status(400).json({ message: "no meetings found" });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.getMeetingByDateAndEmail = async (req, res) => {
  try {
    let start = new Date(req.params.date);
    console.log("Start:::::::::::::::", start);

    let end = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + 2
    );
    console.log("end....", end);

    const meetings = await Meeting.find({
      "schedule.start": {
        $gte: start,
        $lt: end,
      },
      inviteList: req.body.email,
    });
    meetings.length > 0
      ? res.status(200).json(meetings)
      : res.status(400).json({ message: "no meetings found" });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndRemove(req.params.id);
    meeting
      ? res.status(200).json({ message: "Meeting Successfully Deleted !" })
      : res.status(400).json({ message: "Unable to Delete" });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.getMeetingDetails = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    meeting
      ? res.status(200).json(meeting)
      : res.status(400).json({ message: "no meetings found" });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.updateMeeting = async (req, res) => {
  try {
    const { title, description, inviteList, schedule } = req.body;
    // let start = new Date(schedule.start);
    // let end = new Date(schedule.end);
    // let scheduleDate = {
    //   start,
    //   end,
    // };
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { title, description, inviteList },
      { new: true }
    );
    meeting &&
      res
        .status(200)
        .json({ message: "Meeting Updated Successfully", meeting });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.uploadMeetingDocuments = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.mid,
      {
        $push: {
          documents:
            process.env.API + "/uploads/ducuments/" + req.file.filename,
        },
      },
      { new: true }
    );
    meeting &&
      res.status(200).json({
        message: "Document Uploaded Successfully",
        documents: meeting.documents,
      });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.updateMeetingFeatures = async (req, res) => {
  try {
    const { features, password } = req.body;
    const meeting = await Meeting.findByIdAndUpdate(
      id,
      { features, password },
      { new: true }
    );
    meeting &&
      res
        .status(200)
        .json({ message: "Meeting Seeting Updated Successfully", meeting });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};
