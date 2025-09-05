// server.js
require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const partnerRoutes = require("./routes/partnersRoutes");
const serviceRoutes = require("./routes/servicesRoutes");
const teamRoutes = require("./routes/teamRoutes");
const faqRoutes = require("./routes/faqsRoutes");
const contactRoutes = require("./routes/contactRoutes");
const policyRoutes = require("./routes/policiesRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

// Swagger
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const openapiPath = path.join(__dirname, "docs", "openapi.yaml");
const swaggerDoc = YAML.load(openapiPath);

const app = express();

/* -------- Core middleware -------- */
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// CORS (dev: allow all; prod: whitelist via env CORS_ORIGINS="https://a.com,https://b.com")
const isProd = process.env.NODE_ENV === "production";
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // curl/postman/native apps
      if (!isProd) return cb(null, true); // allow all in dev
      return cb(null, allowedOrigins.includes(origin)); // strict in prod
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    exposedHeaders: ["Content-Range", "X-Total-Count"],
    maxAge: 600,
  })
);

// NOTE: Removed the problematic `app.options('*', ...)` line

/* -------- DB connect -------- */
connectDB();

/* -------- API routes -------- */
app.use("/api/auth", authRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/contact", contactRoutes); // includes GET/POST/PUT and send-message
app.use("/api/policies", policyRoutes);
app.use("/api/feedback", feedbackRoutes);

/* -------- Swagger -------- */
app.get("/docs.json", (req, res) => res.json(swaggerDoc));
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: "Sportech Admin API Docs",
  })
);
// optional: quick health check
app.get("/healthz", (req, res) => res.json({ ok: true }));

/* -------- Start server -------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
