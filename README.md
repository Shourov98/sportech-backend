# Sportech Backend API

A comprehensive backend API for Sportech's digital platform, handling authentication, content management, and user interactions.

## 🚀 Features

- **Authentication System**

  - JWT-based authentication with secure cookies
  - Role-based access control (Admin/User)
  - Secure password hashing with bcrypt

- **Content Management**

  - Partner management (CRUD operations)
  - Services catalog management
  - Team member profiles
  - FAQ management
  - Contact information management

- **User Interaction**

  - Secure contact form with email notifications
  - Feedback system

- **Security**
  - CORS protection
  - Secure cookie settings
  - Environment-based security configurations

## 🛠 Tech Stack

- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with secure HTTP-only cookies
- **File Upload**: Multer
- **Email**: Nodemailer
- **API Documentation**: Swagger/OpenAPI
- **Environment Management**: dotenv
- **Request Parsing**: body-parser, cookie-parser

## 📦 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- SMTP server (for email functionality)

## 🔧 Environment Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd sportech-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with these variables:

   ```env
   # Server Configuration
   PORT=4000
   NODE_ENV=development

   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/sportech

   # JWT
   JWT_SECRET=your_secure_jwt_secret
   JWT_EXPIRES_IN=1d

   # Cookies
   COOKIE_SECURE=false  # Set to 'true' in production with HTTPS

   # Email Configuration
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your-email@example.com
   SMTP_PASS=your-email-password
   ADMIN_EMAIL=admin@example.com

   # File Upload
   MAX_FILE_UPLOAD=10  # in MB
   FILE_UPLOAD_PATH=./uploads

   # CORS
   CORS_ORIGIN=http://localhost:3000
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

The server will start on `http://localhost:4000` by default.

### Production Mode

```bash
npm start
# or
yarn start
```

## 📚 API Documentation

Access the interactive API documentation at:

- Swagger UI: `http://localhost:4000/api-docs`
- OpenAPI JSON: `http://localhost:4000/api-docs.json`

## 🗂 Project Structure

```
├── config/           # Database and other configurations
├── controllers/      # Route controllers
├── middleware/       # Custom middleware (auth, error handling)
├── models/           # Mongoose models
├── routes/           # Route definitions
├── utils/            # Utility functions (JWT, email, etc.)
├── uploads/          # File uploads directory
├── .env              # Environment variables
├── .gitignore
├── package.json
└── server.js         # Application entry point
```

## 🔒 Authentication

1. Login to obtain a JWT token:

   ```http
   POST /api/auth/login
   Content-Type: application/json

   {
     "email": "admin@example.com",
     "password": "yourpassword"
   }
   ```

2. Include the token in subsequent requests:

   ```http
   GET /api/protected-route
   Authorization: Bearer <your-jwt-token>
   ```

   Or let the browser handle the HTTP-only cookie automatically.

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
