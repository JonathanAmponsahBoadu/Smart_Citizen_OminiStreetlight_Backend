const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createReport,
  getAllReports,
  getReportById,
  deleteReport,
  upload,
} = require("../controllers/reportsController");
const authenticate = require("../middlewares/authMiddleware");
const authorizedRoles = require("../middlewares/authorizedRoles");

/**
 * @swagger
 * /api/report:
 *   post:
 *     summary: Report an issue
 *     description: Public users can report any faulty public properties with optional media upload.
 *     tags:
 *       - Reports
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               media:
 *                 type: string
 *                 format: binary
 *                 description: Optional media file (image/video) to upload along with the report.
 *               propertyId:
 *                 type: string
 *                 description: The ID of the property that is being reported.
 *               description:
 *                 type: string
 *                 description: Detailed description of the issue with the property.
 *     responses:
 *       201:
 *         description: Report created successfully.
 *       400:
 *         description: Bad request (e.g., missing required fields or invalid data).
 *       500:
 *         description: Internal Server Error.
 */

router.post("/report", upload.single("media"), createReport);

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get all reports
 *     description: Supervisors can fetch all reports submitted by users.
 *     tags:
 *       - Reports
 *     security:
 *       - BearerAuth: [] # Requires authentication
 *     responses:
 *       200:
 *         description: Successfully fetched reports.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   reportId:
 *                     type: string
 *                   propertyId:
 *                     type: string
 *                   description:
 *                     type: string
 *                   mediaUrl:
 *                     type: string
 *                   submittedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal Server Error.
 */
router.get(
  "/reports",
  authenticate,
  authorizedRoles("supervisor"),
  getAllReports
);

/**
 * @swagger
 * /api/report/{reportId}:
 *   get:
 *     summary: Get a specific report by ID
 *     description: Supervisors can fetch a specific report by its ID.
 *     tags:
 *       - Reports
 *     security:
 *       - BearerAuth: [] # Requires authentication
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         description: The ID of the report to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched the report.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reportId:
 *                   type: string
 *                 propertyId:
 *                   type: string
 *                 description:
 *                   type: string
 *                 mediaUrl:
 *                   type: string
 *                 submittedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Report not found.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal Server Error.
 */
router.get(
  "/report/:reportId",
  authenticate,
  authorizedRoles("supervisor"),
  getReportById
);

/**
 * @swagger
 * /api/report/{reportId}:
 *   delete:
 *     summary: Delete a report
 *     description: Supervisors can delete a report by its ID.
 *     tags:
 *       - Reports
 *     security:
 *       - BearerAuth: [] # Requires authentication
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         description: The ID of the report to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report deleted successfully.
 *       404:
 *         description: Report not found.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal Server Error.
 */
router.delete(
  "/report/:reportId",
  authenticate,
  authorizedRoles("supervisor"),
  deleteReport
);
module.exports = router;
