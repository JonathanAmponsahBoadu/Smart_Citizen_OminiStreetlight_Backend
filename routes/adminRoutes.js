const express = require("express");
const Router = express.Router();
const authorizedRoles = require("../middlewares/authorizedRoles");
const createAccount = require("../controllers/adminController");

Router.post("/users", authorizedRoles("admin"), createAccount);

module.exports = Router;
