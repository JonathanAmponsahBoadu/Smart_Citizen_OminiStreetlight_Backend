const express = require("express");
const router = express.Router();
const {
  assignTask,
  updateTaskStatus,
  getAllTasks,
  getTaskById,
  addTaskComment,
} = require("../controllers/taskController");
const authorizedRoles = require("../middleware/authorizeRoles");

router.post("/tasks/assign", authorizedRoles("supervisor"), assignTask);
router.patch(
  "/tasks/:id/status",
  authorizedRoles("engineer"),
  updateTaskStatus
);
router.get("/tasks", authorizedRoles("admin", "supervisor"), getAllTasks);
router.get(
  "tasks/:id/task",
  authorizedRoles("admin", "supervisor"),
  getTaskById
);
router.post(
  "/api/tasks/:id/comment",
  authorizedRoles("supervisor", "engineer"),
  addTaskComment
);
module.exports = router;
