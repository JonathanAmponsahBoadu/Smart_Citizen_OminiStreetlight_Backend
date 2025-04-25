const express = require("express");
const Router = express.Router();
const authorizedRoles = require("../middlewares/authorizedRoles");
const createAccount = require("../controllers/adminController");

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user account
 *     description: Only admins can create new user accounts (e.g., supervisors, engineers).
 *     tags:
 *       - Users
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
 *               - passwordHash
 *               - createdAt
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
 *               passwordHash:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time

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

Router.post("/users", authorizedRoles("admin"), createAccount);

module.exports = Router;
