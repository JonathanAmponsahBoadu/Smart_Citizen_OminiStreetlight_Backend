const bcrypt = require("bcrypt");

const verifyPassword = async () => {
  const password = "admin@example.com"; // Replace with the password you want to test
  const hash = await bcrypt.hash(password, 10); // Your hash
  console.log(hash);
  const isMatch = await bcrypt.compare(password, hash);
  console.log("Password match:", isMatch);
};

verifyPassword();
