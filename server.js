const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const express = require("express");
const connectDB = require("./Lib/db");
const adminRoutes = require("./routes/adminRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const reportRoutes = require("./routes/reportRoutes");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const app = express();
const cors = require("cors");
require("dotenv").config();
const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || "admin@example.com";
const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "admin123";

const port = process.env.PORT || 5000;

const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

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
        url: process.env.URL,
      },
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const createDefaultAdmin = async () => {
  try {
    const existingUsers = await User.find();
    if (existingUsers.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      console.log(hashedPassword);
      const admin = new User({
        fullName: "Default Admin",
        email: adminEmail,
        phoneNumber: "1234567890",
        role: "admin",
        passwordHash: hashedPassword,
        createdAt: new Date(),
      });
      await admin.save();
      console.log(
        "Default admin user created with email: admin@example.com and password: admin123"
      );
      console.log(hashedPassword);
    } else {
      console.log(
        "Users already exist in the database. Skipping default admin creation."
      );
    }
  } catch (err) {
    console.error("Error creating default admin user:", err);
  }
};

app.use("/api", propertyRoutes);
app.use("/api", adminRoutes);
app.use("/api", reportRoutes);
app.use("/api", taskRoutes);
app.use("/api", authRoutes);

connectDB().then(() => {
  createDefaultAdmin();
  app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`);
  });
});
