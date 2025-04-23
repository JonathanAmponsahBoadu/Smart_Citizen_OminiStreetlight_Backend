const Report = require("../modules/Report");
// const multer = require("multer");
// const { v4: uuidv4 } = require("uuid");
const reportIssue = async (req, res, next) => {
  const { reportId, propertyId, description, mediaUrl } = req.body;
  try {
    const newReport = await new Report({
      reportId: reportId,
      propertyId: propertyId,
      description: description,
      mediaUrl: mediaUrl,
    });

    await newReport.save();
  } catch (err) {
    console.error(`Invalid report ${err}`);
  }
};

module.exports = reportIssue;
