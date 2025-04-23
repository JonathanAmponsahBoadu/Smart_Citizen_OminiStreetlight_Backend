const express = require("express");
const Router = express.Router();
const reportIssue = require("../controllers/publicReports");

Router.post("/public-report", reportIssue);

module.exports = Router;
