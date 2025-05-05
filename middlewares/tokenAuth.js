const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
require("dotenv").config();

const generateToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
    user_id: uuid(),
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5d" });
};

module.exports = generateToken;
