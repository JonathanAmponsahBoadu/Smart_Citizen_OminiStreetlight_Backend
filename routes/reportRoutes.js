const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createReport, upload } = require("../controllers/reportsController");

/**
 * @swagger
 * /report:
 *   post:
 *     summary: Report an issue
 *     description: Public users can report any faulty public properties with optional media upload.
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: formData
 *         name: media
 *         description: Optional media file (image/video) to upload along with the report.
 *         required: false
 *         type: file
 *       - in: body
 *         name: report
 *         description: Report details (e.g., description of the issue, property ID).
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             propertyId:
 *               type: string
 *               description: The ID of the property that is being reported.
 *             description:
 *               type: string
 *               description: Detailed description of the issue with the property.
 *             location:
 *               type: object
 *               properties:
 *                 lat:
 *                   type: number
 *                   description: Latitude of the property.
 *                 lng:
 *                   type: number
 *                   description: Longitude of the property.
 *     responses:
 *       201:
 *         description: Report created successfully.
 *       400:
 *         description: Bad request (e.g., missing required fields or invalid data).
 *       500:
 *         description: Internal Server Error.
 */

router.post("/report", upload.single("media"), createReport);

module.exports = router;
