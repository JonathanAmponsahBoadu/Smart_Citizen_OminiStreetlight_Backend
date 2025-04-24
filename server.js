const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const express = require("express");
const connectDB = require("./Lib/db");
const adminRoutes = require("./routes/adminRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const reportRoutes = require("./routes/reportRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Citizen Platform API",
      version: "1.0.0",
      description: "API documentation for the Smart Citizen backend",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

connectDB();

app.use(express.json());

app.use("/api", propertyRoutes);
app.use("/api", adminRoutes);
app.use("/api", reportRoutes);
app.use("/api", taskRoutes);

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
