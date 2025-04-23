const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  report: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["pending", "in_progress", "fixed", "cannot_fix"],
    default: "pending",
  },
  comments: [
    {
      body: String,
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
