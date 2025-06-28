const Task = require("../models/Task");
const Report = require("../models/Report");
const Property = require("../models/Property");

const assignTask = async (req, res) => {
  try {
    const { reportId, propertyId, engineerId, assignedBy } = req.body;

    const report = await Report.findById(reportId);
    const property = await Property.findById(propertyId);

    if (!report || !property) {
      return res.status(404).json({ message: "Report or Property not found" });
    }

    const task = new Task({
      report: reportId,
      property: propertyId,
      assignedTo: engineerId,
      assignedBy: assignedBy,
    });

    await task.save();

    res.status(200).json({
      message: "Task assigned successfully",
      task: task,
    });
  } catch (err) {
    console.error("Error assigning task:", err);
    res.status(500).json({ message: "Failed to assign task" });
  }
};

const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "in_progress", "fixed", "cannot_fix"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        status,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (err) {
    console.error("Error updating task status:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const filters = {};

    if (req.query.status) filters.status = req.query.status;
    if (req.query.engineerId) filters.assignedTo = req.query.engineerId;
    if (req.query.propertyId) filters.property = req.query.propertyId;

    const tasks = await Task.find(filters)
      .populate("assignedTo", "fullName email")
      .populate("assignedBy", "fullName email")
      .populate("report")
      .populate("property");

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error getting tasks:", err);
    res.status(500).json({ message: "Failed to get tasks" });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "fullName email")
      .populate("assignedBy", "fullName email")
      .populate("report")
      .populate("property")
      .populate("comments.createdBy", "fullName email");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addTaskComment = async (req, res) => {
  try {
    const { text, userId } = req.body;
    const taskId = req.params.id;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.comments.push({
      body: text,
      createdBy: userId,
      createdAt: new Date(),
    });

    await task.save();

    res.status(201).json({ message: "Comment added successfully", task });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTaskComments = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "comments.createdBy",
      "fullName email"
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ comments: task.comments });
  } catch (err) {
    console.error("Error fetching task comments:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllComments = async (req, res) => {
  try {
    const tasks = await Task.find().populate(
      "comments.createdBy",
      "fullName email"
    );
    const allComments = tasks.flatMap((task) =>
      task.comments.map((comment) => ({
        ...comment.toObject(),
        taskId: task._id,
      }))
    );
    return res.status(200).json({ comments: allComments });
  } catch (err) {
    console.error("Error fetching all comments:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteTaskComment = async (req, res) => {
  const { id, commentId } = req.params;
  try {
    const task = await Task.findById(id); // <-- Add await here
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const commentIndex = task.comments.findIndex(
      (c) => c._id.toString() === commentId
    );
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }
    task.comments.splice(commentIndex, 1);
    await task.save();
    return res
      .status(200)
      .json({ message: "Comment deleted successfully", task });
  } catch (err) {
    console.error("Error deleting comment:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.log(`Deleting task failed ${err}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  assignTask,
  updateTaskStatus,
  getAllTasks,
  getTaskById,
  addTaskComment,
  getTaskComments,
  getAllComments,
  deleteTaskComment,
  deleteTask,
};
