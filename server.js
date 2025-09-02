require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const partnerRoutes = require("./routes/partnersRoutes");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/partners", partnerRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

// Swagger Documentation
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const openapiPath = path.join(__dirname, "docs", "openapi.yaml");
const swaggerDoc = YAML.load(openapiPath);

app.get("/docs.json", (req, res) => res.json(swaggerDoc));
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: "Admin Auth API Docs",
  })
);
