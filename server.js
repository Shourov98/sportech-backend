require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const partnerRoutes = require("./routes/partnersRoutes");
const serviceRoutes = require("./routes/servicesRoutes");
const teamRoutes = require("./routes/teamRoutes");
const faqRoutes = require("./routes/faqsRoutes");
const contactRoutes = require("./routes/contactRoutes");
const policyRoutes = require("./routes/policiesRoutes");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/policies", policyRoutes);

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
