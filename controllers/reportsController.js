const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const Report = require("../models/Report");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
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

    res.status(201).json({
      message: "Report submitted successfully",
      reportId: newReport.reportId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error submitting the report" });
  }
};

module.exports = {
  createReport,
  upload,
};
