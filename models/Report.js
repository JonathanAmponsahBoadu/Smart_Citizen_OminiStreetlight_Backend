const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
  reportId: String,
  propertyId: String,
  description: String,
  mediaUrl: String,
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
