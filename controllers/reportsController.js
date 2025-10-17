const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const Report = require("../models/Report");
const cloudinary = require("../Lib/cloud");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["png", "jpeg", "jpeg"],
  },
});

const upload = multer({ storage });

const createReport = async (req, res) => {
  try {
    const { propertyId, description } = req.body;
    const reportId = uuidv4();

    let media = null;
    if (req.file) {
      media = req.file.path;
    }

    const newReport = new Report({
      propertyId,
      description,
      reportId,
      mediaUrl: media,
    });

    await newReport.save();

    return res.status(201).json({
      message: "Report submitted successfully",
      reportId: newReport.reportId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error submitting the report" });
  }
};

const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find();
    if (!reports) {
      return res.status(404).json({ message: "No reports found" });
    }
    res.status(200).json({ reports });
  } catch (err) {
    console.log(`Error getting reports ${err}`);
    return res.status(500).json({ message: "Error fetching reports" });
  }
};

const getReportById = async (req, res) => {
  const { id } = req.params;
  try {
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: "report not found" });
    }
    res.status(200).json({ report });
  } catch (err) {
    console.log(`Error getting report ${err}`);
    res.status(500).json({ message: "Error fetching report" });
  }
};

const deleteReport = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedReport = await Report.findByIdAndDelete(id);
    if (!deletedReport) {
      return res.status(404).json({ message: "report not found" });
    }
    return res.status(200).json({ message: "report deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting report" });
  }
};

module.exports = {
  createReport,
  getAllReports,
  getReportById,
  deleteReport,
  upload,
};
