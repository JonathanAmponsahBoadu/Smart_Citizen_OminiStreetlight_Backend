const express = require("express");
const router = express.Router();
const {
  createProperty,
  getAllProperties,
} = require("../controllers/propertyController");
const authorizedRoles = require("../middlewares/authorizedRoles");

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: Get all properties
 *     description: Admins and supervisors can retrieve a list of all registered properties.
 *     tags:
 *       - Properties
 *     responses:
 *       200:
 *         description: Successfully fetched properties.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal Server Error
 */

router.get(
  "/properties",
  authorizedRoles("admin", "supervisor"),
  getAllProperties
);

/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Create a new property
 *     description: Admins and supervisors can add a new property (like streetlights, roads, etc.) with its location and state.
 *     tags:
 *       - Properties
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - propertyId
 *               - type
 *               - location
 *               - state
 *             properties:
 *               propertyId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [streetlight, road, pipe, bridge]
 *               location:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                   coordinates:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                       lng:
 *                         type: number
 *               state:
 *                 type: string
 *                 enum: [working, damaged, under_repair, fixed, pending]
 *     responses:
 *       201:
 *         description: Property created successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal Server Error.
 */

router.post(
  "/properties",
  authorizedRoles("admin", "supervisor"),
  createProperty
);

module.exports = router;
