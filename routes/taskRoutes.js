const express = require("express");
const router = express.Router();
const {
  assignTask,
  updateTaskStatus,
  getAllTasks,
  getTaskById,
  addTaskComment,
} = require("../controllers/taskController");
const authorizedRoles = require("../middlewares/authorizedRoles");

/**
 * @swagger
 * /tasks/assign:
 *   post:
 *     summary: Assign a task to an engineer
 *     description: Only a supervisor can assign a task to an engineer.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: body
 *         name: task
 *         description: The task details to assign.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             reportId:
 *               type: string
 *             propertyId:
 *               type: string
 *             engineerId:
 *               type: string
 *     responses:
 *       201:
 *         description: Task successfully assigned.
 *       400:
 *         description: Bad request (e.g., missing fields).
 *       403:
 *         description: Unauthorized, only supervisors can assign tasks.
 *       500:
 *         description: Internal Server Error.
 */
router.post("/tasks/assign", authorizedRoles("supervisor"), assignTask);

/**
 * @swagger
 * /tasks/{id}/status:
 *   patch:
 *     summary: Update the status of a task
 *     description: Only an engineer can update the status of a task they are assigned to.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the task.
 *         type: string
 *       - in: body
 *         name: status
 *         description: The new status of the task.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [pending, in_progress, fixed, cannot_fix]
 *     responses:
 *       200:
 *         description: Task status updated.
 *       400:
 *         description: Invalid status provided.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Internal Server Error.
 */
router.patch(
  "/tasks/:id/status",
  authorizedRoles("engineer"),
  updateTaskStatus
);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Get all tasks for admin or supervisor, with optional filters.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: query
 *         name: status
 *         description: Filter tasks by status (e.g., pending, in_progress).
 *         type: string
 *       - in: query
 *         name: engineerId
 *         description: Filter tasks assigned to a specific engineer.
 *         type: string
 *       - in: query
 *         name: propertyId
 *         description: Filter tasks by property ID.
 *         type: string
 *     responses:
 *       200:
 *         description: List of tasks.
 *       500:
 *         description: Internal Server Error.
 */
router.get("/tasks", authorizedRoles("admin", "supervisor"), getAllTasks);

/**
 * @swagger
 * /tasks/{id}/task:
 *   get:
 *     summary: Get a specific task by ID
 *     description: Get detailed information about a task by its ID.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the task.
 *         type: string
 *     responses:
 *       200:
 *         description: Task details retrieved.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Internal Server Error.
 */
router.get(
  "/tasks/:id/task",
  authorizedRoles("admin", "supervisor"),
  getTaskById
);

/**
 * @swagger
 * /tasks/{id}/comment:
 *   post:
 *     summary: Add a comment to a task
 *     description: Both engineers and supervisors can add comments to tasks.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the task to comment on.
 *         type: string
 *       - in: body
 *         name: comment
 *         description: The comment text.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             text:
 *               type: string
 *     responses:
 *       201:
 *         description: Comment added successfully.
 *       400:
 *         description: Bad request (e.g., missing comment text).
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Internal Server Error.
 */
router.post(
  "/api/tasks/:id/comment",
  authorizedRoles("supervisor", "engineer"),
  addTaskComment
);

module.exports = router;
