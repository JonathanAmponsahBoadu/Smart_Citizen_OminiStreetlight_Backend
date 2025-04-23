const express = require("express");
const router = express.Router();
const {
  createProperty,
  getProperties,
} = require("../controllers/propertyController");
const authorizeRoles = require("../middleware/authorizeRoles");

router.get("/properties", authorizeRoles("admin", "supervisor"), getProperties);

router.post(
  "/properties",
  authorizeRoles("admin", "supervisor"),
  createProperty
);

module.exports = router;
