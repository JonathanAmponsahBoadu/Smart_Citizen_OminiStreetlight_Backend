const express = require("express");
const router = express.Router();
const {
  createProperty,
  getAllProperties,
  deleteProperty,
  updatePropertyStatus,
  getPropertyById,
} = require("../controllers/propertyController");
const authorizedRoles = require("../middlewares/authorizedRoles");
const authenticate = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/properties:
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
  authenticate,
  authorizedRoles("admin", "supervisor"),
  getAllProperties
);

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Get a specific property by ID
 *     description: Admins and supervisors can retrieve detailed information about a specific property by its ID.
 *     tags:
 *       - Properties
 *     security:
 *       - BearerAuth: [] # Requires authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the property to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Property retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 propertyId:
 *                   type: string
 *                 type:
 *                   type: string
 *                   enum: [streetlight, road, pipe, bridge]
 *                 location:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: string
 *                     coordinates:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                         lng:
 *                           type: number
 *                 state:
 *                   type: string
 *                   enum: [working, damaged, under_repair, fixed, pending]
 *                 createdBy:
 *                   type: string
 *                   description: The ID of the user who created the property.
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Property not found.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal Server Error.
 */

router.get(
  "/properties/:id",
  authenticate,
  authorizedRoles("admin", "supervisor"),
  getPropertyById
);

/**
 * @swagger
 * /api/properties:
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
 *               - type
 *               - address
 *               - lat
 *               - lng
 *               - state
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [streetlight, road, pipe, bridge]
 *               address:
 *                 type: string
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
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
  authenticate,
  authorizedRoles("admin", "supervisor"),
  createProperty
);

/**
 * @swagger
 * /api/properties/{propertyId}:
 *   patch:
 *     summary: Update the status of a property
 *     description: Admins and supervisors can update the status of a property.
 *     tags:
 *       - Properties
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         description: The ID of the property to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *                 enum: [working, damaged, under_repair, fixed, pending]
 *     responses:
 *       200:
 *         description: Property status updated successfully.
 *       400:
 *         description: Invalid state value.
 *       404:
 *         description: Property not found.
 *       500:
 *         description: Internal Server Error.
 */
router.patch(
  "/properties/:propertyId",
  authenticate,
  authorizedRoles("admin", "supervisor"),
  updatePropertyStatus
);

/**
 * @swagger
 * /api/properties/{propertyId}:
 *   delete:
 *     summary: Delete a property
 *     description: Admins can delete a property by its propertyId.
 *     tags:
 *       - Properties
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         description: The ID of the property to delete.
 *         type: string
 *     responses:
 *       200:
 *         description: Property deleted successfully.
 *       404:
 *         description: Property not found.
 *       500:
 *         description: Internal Server Error.
 */
router.delete(
  "/properties/:propertyId",
  authenticate,
  authorizedRoles("admin"),
  deleteProperty
);

module.exports = router;
