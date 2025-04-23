const User = require("../models/User");
const bcrypt = require("bcrypt");

const createAccount = async (req, res) => {
  const { fullName, email, phoneNumber, role, passwordHash, createdAt } =
    req.body;

  if (!["admin", "supervisor", "engineer"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const existing_user = await User.findOne({ email });
    if (existing_user) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({
      fullName,
      email,
      phoneNumber,
      role,
      passwordHash: passwordHash,
      createdAt,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", userId: newUser._id });
  } catch (err) {
    console.error(`User not created ${err}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = createAccount;
