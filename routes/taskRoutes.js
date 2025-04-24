const express = require("express");
const router = express.Router();
const {
  assignTask,
  updateTaskStatus,
  getAllTasks,
  getTaskById,
  addTaskComment,
} = require("../controllers/taskController");
const authorizeRoles = require("../middleware/authorizeRoles");

router.post("/tasks/assign", authorizeRoles("supervisor"), assignTask);
router.patch("/tasks/:id/status", authorizeRoles("engineer"), updateTaskStatus);
router.get("/tasks", authorizeRoles("admin", "supervisor"), getAllTasks);
router.get(
  "tasks/:id/task",
  aurthorizedRoles("admin", "supervisor"),
  getTaskById
);
router.post(
  "/api/tasks/:id/comment",
  authorizeRoles("supervisor", "engineer"),
  addTaskComment
);
module.exports = router;
