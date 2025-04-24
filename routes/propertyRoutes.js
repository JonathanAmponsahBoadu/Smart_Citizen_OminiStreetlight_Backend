const express = require("express");
const router = express.Router();
const {
  createProperty,
  getAllProperties,
} = require("../controllers/propertyController");
const authorizedRoles = require("../middlewares/authorizedRoles");

router.get(
  "/properties",
  authorizedRoles("admin", "supervisor"),
  getAllProperties
);

router.post(
  "/properties",
  authorizedRoles("admin", "supervisor"),
  createProperty
);

module.exports = router;
