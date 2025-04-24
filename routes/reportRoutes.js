const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createReport, upload } = require("../controllers/reportsController");

router.post("/report", upload.single("media"), createReport);

module.exports = router;
