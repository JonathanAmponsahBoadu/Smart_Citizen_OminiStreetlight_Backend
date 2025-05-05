const User = require("../models/User");
const bcrypt = require("bcrypt");

const createAccount = async (req, res) => {
  const { fullName, email, phoneNumber, role, password } = req.body;

  if (!["admin", "supervisor", "engineer"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const existing_user = await User.findOne({ email });
    if (existing_user) {
      return res.status(409).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      phoneNumber,
      role,
      passwordHash,
    });

    await newUser.save();

    return res
      .status(201)
      .json({ message: "User created successfully", userId: newUser._id });
  } catch (err) {
    console.error(`User not created: ${err}`);

    if (!res.headersSent) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const deleteAccount = async (req, res) => {
  const { email } = req.body;
  try {
    const deletedAccount = await User.findOne({ email });
    if (!deletedAccount) {
      return res.status(404).json({ message: "Account not found" });
    }
    if (deletedAccount.role === "admin") {
      return res
        .status(401)
        .json({ message: "You cannot delete an admin account" });
    }

    await deletedAccount.deleteOne();

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.log(`Error deleting account ${err}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createAccount, deleteAccount };
