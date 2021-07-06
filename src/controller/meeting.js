const Meeting = require("../models/meeting");
const moment = require("moment");
const env = require("dotenv");

//Environment Variable
env.config();

exports.createMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ roomName: req.body.roomName });
    if (meeting) {
      console.log("roomName already exits");
      return res.status(403).json({
        status: 403,
        success: false,
        message: "roomName already exits",
      });
    } else {
      const {
        roomName,
        title,
        description,
        attendees,
        schedule,
        createdBy,
        features,
      } = req.body;
      // let start = schedule.start;
      // let end = schedule.end;
      //////////// For Development Purpose////////////////////
      // const d = new Date();
      // console.log("d", d);
      // let start = new Date();
      // console.log("start", start);
      // let [month, date, year] = start.toLocaleDateString("en-IN").split("/");
      // let [hour] = start.toLocaleTimeString("en-US").split(/:| /);
      // console.log("month, date, year, hour", month, date, year, hour);
      // let end = new Date(year, month, date, parseInt(hour) + 2, 0, 0);
      // console.log("end", end);

      // let scheduleDate = {
      //   start,
      //   end,
      // };
      /////////////////////////////////////////////////////

      const meeting = await new Meeting({
        roomName,
        title,
        description,
        attendees,
        schedule,
        createdBy,
        features,
      }).save();
      meeting &&
        res.status(201).json({
          status: 201,
          success: true,
          message: `Meeting created successfully`,
          meeting,
        });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.getAllMeeting = async (req, res) => {
  try {
    var filter = {};
    if (req.body.date) {
      let start = new Date(req.body.date);
      console.log("Start:::::::::::::::", start);

      const end =
        new Date(start).getFullYear() +
        "-" +
        (new Date(start).getMonth() + 1 >= 10
          ? new Date(start).getMonth() + 1
          : "0" + (new Date(start).getMonth() + 1)) +
        "-" +
        (new Date(start).getDate() + 1 >= 10
          ? new Date(start).getDate() + 1
          : "0" + (new Date(start).getDate() + 1));

      console.log("end............", end, new Date(end));

      filter = {
        "schedule.start": {
          $gte: start,
          $lte: new Date(end),
        },
      };
    }

    const meetings = await Meeting.find(filter)
      .populate("createdBy", "fullName username email image")
      .populate("attendees", "fullName username email image");
    meetings.length > 0
      ? res.status(200).json({ status: 200, success: true, meetings })
      : res
          .status(404)
          .json({ status: 404, success: false, message: "No meetings found" });
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.searchMeeting = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      $or: [{ title: { $regex: req.params.query } }],
    })
      .populate("createdBy", "fullName username email image")
      .populate("attendees", "fullName username email image");
    meetings.length > 0
      ? res.status(200).json({ status: 200, success: true, meetings })
      : res
          .status(404)
          .json({ status: 404, success: false, message: "No meetings found" });
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.getMeetingByDateAndEmail = async (req, res) => {
  try {
    let start = new Date(req.params.date);
    console.log("Start:::::::::::::::", start);

    const end =
      new Date(start).getFullYear() +
      "-" +
      (new Date(start).getMonth() + 1 >= 10
        ? new Date(start).getMonth() + 1
        : "0" + (new Date(start).getMonth() + 1)) +
      "-" +
      (new Date(start).getDate() + 1 >= 10
        ? new Date(start).getDate() + 1
        : "0" + (new Date(start).getDate() + 1));

    console.log("end............", end, new Date(end));

    const meetings = await Meeting.find({
      "schedule.start": {
        $gte: start,
        $lte: new Date(end),
      },
      attendees: req.params.userId,
    });
    // console.log(meetings);
    meetings.length > 0
      ? res.status(200).json({ status: 200, success: true, meetings })
      : res
          .status(404)
          .json({ status: 404, success: false, message: "no meetings found" });
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);

    meeting
      ? res.status(200).json({
          status: 200,
          success: true,
          message: "Meeting Successfully Deleted !",
        })
      : res
          .status(501)
          .json({ status: 501, success: false, message: "Unable to Delete" });
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.getMeetingDetails = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    meeting
      ? res.status(200).json({ status: 200, success: true, meeting })
      : res
          .status(404)
          .json({ status: 404, success: false, message: "no meetings found" });
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.updateMeeting = async (req, res) => {
  try {
    const { title, description, attendees, schedule } = req.body;
    // let start = new Date(schedule.start);
    // let end = new Date(schedule.end);
    // let scheduleDate = {
    //   start,
    //   end,
    // };
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { title, description, attendees, schedule },
      { new: true }
    );
    meeting &&
      res.status(200).json({
        status: 200,
        success: true,
        message: "Meeting Updated Successfully",
        meeting,
      });
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
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
        status: 200,
        success: true,
        message: "Document Uploaded Successfully",
        documents: meeting.documents,
      });
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
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
      res.status(200).json({
        status: 200,
        success: true,
        message: "Meeting Seeting Updated Successfully",
        meeting,
      });
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};
