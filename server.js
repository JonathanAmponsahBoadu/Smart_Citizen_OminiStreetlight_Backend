const express = require("express");
const connectDB = require("./Lib/db");
const adminRoutes = require("./routes/adminRoutes");
const publicRoutes = require("./routes/publicRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const reportRoutes = require("./routes/reportRoutes");
const app = express();
require("dotenv").config();
port = process.env.PORT || 5000;

connectDB();

app.use("/api", propertyRoutes);
app.use("/api", adminRoutes);
app.use("/api", reportRoutes);

app.listen(port, () => {
  console.log(`Running on port $https://localhost:${port}`);
});
