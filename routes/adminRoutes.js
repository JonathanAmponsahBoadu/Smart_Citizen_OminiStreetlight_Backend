const express = require("express");
const Router = express.Router();
const authorizedRoles = require("../middlewares/authorizedRoles");
const {
  createAccount,
  getAccount,
  getAllAccounts,
  deleteAccount,
} = require("../controllers/adminController");
const authenticate = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user account
 *     description: Only admins can create new user accounts (e.g., supervisors, engineers).
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: [] # Add this line to secure the endpoint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - phoneNumber
 *               - role
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [supervisor, engineer]
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User account created successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal Server Error.
 */

Router.post("/users", authenticate, authorizedRoles("admin"), createAccount);

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get a specific user account
 *     description: Admins can retrieve a specific user account by its ID.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: [] # Requires authentication
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user to retrieve.
 *     responses:
 *       200:
 *         description: User account retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Account:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique ID of the user.
 *                     fullName:
 *                       type: string
 *                       description: The full name of the user.
 *                     email:
 *                       type: string
 *                       description: The email address of the user.
 *                     phoneNumber:
 *                       type: string
 *                       description: The phone number of the user.
 *                     role:
 *                       type: string
 *                       enum: [admin, supervisor, engineer]
 *                       description: The role of the user.
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time the user was created.
 *       404:
 *         description: Account not found.
 *       500:
 *         description: Internal Server Error.
 */
Router.get(
  "/users/:userId",
  authenticate,
  authorizedRoles("admin"),
  getAccount
);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all user accounts
 *     description: Admins can retrieve all user accounts.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: [] # Requires authentication
 *     responses:
 *       200:
 *         description: User accounts retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accounts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique ID of the user.
 *                       fullName:
 *                         type: string
 *                         description: The full name of the user.
 *                       email:
 *                         type: string
 *                         description: The email address of the user.
 *                       phoneNumber:
 *                         type: string
 *                         description: The phone number of the user.
 *                       role:
 *                         type: string
 *                         enum: [admin, supervisor, engineer]
 *                         description: The role of the user.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time the user was created.
 *       404:
 *         description: No accounts found.
 *       500:
 *         description: Internal Server Error.
 */
Router.get("/users", authenticate, authorizedRoles("admin"), getAllAccounts);

/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Delete a user account
 *     description: Only admins can delete user accounts. Admin accounts cannot be deleted.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: [] # Requires authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user account to delete.
 *     responses:
 *       200:
 *         description: Account deleted successfully.
 *       401:
 *         description: Unauthorized. Admin accounts cannot be deleted.
 *       404:
 *         description: Account not found.
 *       500:
 *         description: Internal Server Error.
 */
Router.delete("/users", authenticate, authorizedRoles("admin"), deleteAccount);
module.exports = Router;
