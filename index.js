const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FitManager API",
      version: "1.0.0",
      description: "API documentation for FitManager",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Health checks
app.get("/health", (req, res) => res.json({ status: "Server is healthy" }));
app.get("/db-health", (req, res) =>
  res.json({ dbState: mongoose.connection.readyState })
);

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/weights", require("./routes/weights"));
app.use("/macros", require("./routes/macros"));
app.use("/hydrations", require("./routes/hydrations"));
app.use("/dashboard", require("./routes/dashboard"));

// Error handling middleware
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

module.exports = app;
