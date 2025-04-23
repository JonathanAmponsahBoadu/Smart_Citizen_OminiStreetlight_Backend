const User = require("../modules/User");
const bcrypt = require("bcrypt");

const createAccount = async (req, res) => {
  const { fullName, email, phoneNumber, role, passwordHash, createdAt } =
    req.body;
  if (!["admin", "supervisor", "engineer"].includes(role)) {
    res.status(400).json({ message: "Invalid role" });
  }

  const existing_user = User.findOne({ email });
  if (existing_user) {
    res.status(409).json({ message: "User already exists" });
  }
  try {
    const passwordHashed = await bcrypt.hash(passwordHash, 10);

    const newUser = await new User({
      fullName: fullName,
      email: email,
      phoneNumber: phoneNumber,
      role: role,
      passwordHash: passwordHashed,
      createdAt: createdAt,
    });

    await newUser.save();
  } catch (err) {
    console.error(`User not created ${err}`);
  }
};

module.exports = createAccount;
