const express = require("express");
const adminRoutes = require("./routes/adminRoutes");
const publicRoutes = require("./routes/publicRoutes");

require("dotenv").config();

const app = express();

port = process.env.PORT || 5000;

app.use("/admin", adminRoutes);

app.use("/user", publicRoutes);

app.listen(port, () => {
  console.log(`Running on port $https://localhost:${port}`);
});
