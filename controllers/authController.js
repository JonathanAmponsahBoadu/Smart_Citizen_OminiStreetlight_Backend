const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../middlewares/tokenAuth");
const { sendEmail } = require("../Lib/email");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!["admin", "supervisor", "engineer"].includes(user.role)) {
      return res.status(403).json({ message: "Access denied for this role" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const requestPasswordReset = async (req, res) => {
  const { email, clientUrl } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ message: "If that email exists, a reset link will be sent" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    user.passwordResetToken = tokenHash;
    user.passwordResetExpires = Date.now() + 3600 * 1000;
    await user.save();

    const base = clientUrl || process.env.CLIENT_URL || "http://localhost:5173";
    const resetLink = `${base.replace(
      /\/$/,
      ""
    )}/password-reset?token=${token}&email=${encodeURIComponent(email)}`;

    const subject = "Password reset request";
    const text = `You requested a password reset. Click the link to set a new password: ${resetLink}`;
    const html = `<p>You requested a password reset.</p><p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`;

    try {
      await sendEmail({ to: email, subject, text, html });
    } catch (emailErr) {
      console.error("Failed to send reset email:", emailErr);
    }

    return res
      .status(200)
      .json({ message: "If that email exists, a reset link will be sent" });
  } catch (err) {
    console.error("Error in requestPasswordReset:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;

  if (!token || !newPassword)
    return res
      .status(400)
      .json({ message: "Token and newPassword are required" });

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const now = Date.now();
    const user = await User.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: now },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res
      .status(200)
      .json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { login, requestPasswordReset, resetPassword };
