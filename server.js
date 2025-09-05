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
// Increase JSON body parser limit to 10MB
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    // You can add specific origins here if needed in the future
    // const allowedOrigins = [
    //   'http://localhost:3000',
    //   'https://yourfrontenddomain.com'
    // ];
    // if (allowedOrigins.includes(origin)) {
    //   return callback(null, true);
    // }
    
    // For now, allow all origins in development
    // In production, you should restrict this to your frontend domains
    return callback(null, true);
  },
  credentials: true, // Enable credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Total-Count'],
  maxAge: 600, // How long the results of a preflight request can be cached (in seconds)
};

// Apply CORS with the above options
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

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
app.use("/api/contact", require("./routes/contactMessageRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));

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
