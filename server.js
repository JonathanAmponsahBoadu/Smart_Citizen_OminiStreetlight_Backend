const express = require("express");
const connectDB = require("./Lib/db");
const adminRoutes = require("./routes/adminRoutes");
const publicRoutes = require("./routes/publicRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const reportRoutes = require("./routes/reportRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.use("/api", propertyRoutes);
app.use("/api", adminRoutes);
app.use("/api", reportRoutes);
app.use("/api", taskRoutes);

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
