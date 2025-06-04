const express = require("express");
const router = express.Router();
const {
  assignTask,
  updateTaskStatus,
  getAllTasks,
  getTaskById,
  addTaskComment,
  deleteTask,
} = require("../controllers/taskController");
const authorizedRoles = require("../middlewares/authorizedRoles");
const authenticate = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/tasks/assign:
 *   post:
 *     summary: Assign a task to an engineer
 *     description: Only admins and supervisors can assign a task to an engineer.
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportId:
 *                 type: string
 *                 description: The ID of the report related to the task.
 *               propertyId:
 *                 type: string
 *                 description: The ID of the property related to the task.
 *               engineerId:
 *                 type: string
 *                 description: The ID of the engineer to whom the task is assigned.
 *               assignedBy:
 *                 type: string
 *                 description: The ID of the supervisor assigning the task.
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
router.post(
  "/tasks/assign",
  authenticate,
  authorizedRoles("admin", "supervisor"),
  assignTask
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Update the status of a task
 *     description: Only admins and engineers can update the status of a task they are assigned to.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the task.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, fixed, cannot_fix]
 *                 description: The new status of the task.
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
  "/tasks/:id",
  authenticate,
  authorizedRoles("admin", "engineer"),
  updateTaskStatus
);

/**
 * @swagger
 * /api/tasks:
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
router.get(
  "/tasks",
  authenticate,
  authorizedRoles("admin", "supervisor", "engineer"),
  getAllTasks
);

/**
 * @swagger
 * /api/tasks/{id}/task:
 *   get:
 *     summary: Get a specific task by ID
 *     description: Admin or supervisor can get detailed information about a task by its ID.
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
  authenticate,
  authorizedRoles("admin", "supervisor", "engineer"),
  getTaskById
);

/**
 * @swagger
 * /api/tasks/{id}/comment:
 *   post:
 *     summary: Add a comment to a task
 *     description: Admins, engineers and supervisors can add comments to tasks.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the task to comment on.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The comment text.
 *               userId:
 *                 type: string
 *                 description: The ID of the user adding the comment.
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
  "/tasks/:id/comment",
  authenticate,
  authorizedRoles("admin", "supervisor", "engineer"),
  addTaskComment
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Supervisors and admins can delete a task by its ID.
 *     tags:
 *       - Tasks
 *     security:
 *       - BearerAuth: [] # Requires authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the task to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 *       404:
 *         description: Task not found.
 *       401:
 *         description: Unauthorized. Only supervisors can delete tasks.
 *       500:
 *         description: Internal Server Error.
 */
router.delete(
  "/tasks/:id",
  authenticate,
  authorizedRoles("admin", "supervisor"),
  deleteTask
);
module.exports = router;
