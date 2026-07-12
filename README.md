<div align="center">

# 🚀 OfferPrep

### AI-Powered Interview Preparation Platform

Prepare Smarter. Crack Interviews with Confidence.

<p align="center">

<img src="https://img.shields.io/badge/React-19-blue?logo=react" />
<img src="https://img.shields.io/badge/FastAPI-0.116-green?logo=fastapi" />
<img src="https://img.shields.io/badge/PostgreSQL-Neon-blue?logo=postgresql" />
<img src="https://img.shields.io/badge/JWT-Authentication-orange" />
<img src="https://img.shields.io/badge/TailwindCSS-v4-38BDF8?logo=tailwindcss" />
<img src="https://img.shields.io/badge/Status-Under%20Development-yellow" />

</p>

</div>

---

# 📖 About

OfferPrep is a modern full-stack interview preparation platform designed to help students and job seekers prepare for technical interviews efficiently.

The platform provides secure authentication, resume management, AI-powered interview generation, personalized feedback, and interview progress tracking.

The goal of OfferPrep is to become a complete one-stop interview preparation ecosystem.

---

# ✨ Current Features

## 🔐 Authentication

- User Registration
- User Login
- Password Hashing using Bcrypt
- JWT Authentication
- Protected Routes
- Dashboard Authentication

---

## 💻 Frontend

- React + Vite
- React Router
- Axios
- Tailwind CSS
- Responsive UI

---

## ⚙ Backend

- FastAPI
- SQLAlchemy ORM
- Alembic Migrations
- JWT Authentication
- REST APIs

---

## 🗄 Database

- PostgreSQL (Neon)
- Users Table
- Secure Password Storage

---

# 🚀 Upcoming Features

- Resume Upload
- Resume Parsing
- AI Interview Generation
- AI Interview Feedback
- Interview History
- Analytics Dashboard
- Profile Management
- Resume Score
- AI Career Suggestions
- Deployment

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios

---

## Backend

- FastAPI
- SQLAlchemy
- Alembic
- Passlib
- Python-Jose

---

## Database

- PostgreSQL
- Neon Database

---

## Authentication

- JWT Authentication
- Password Hashing (bcrypt)

---

## AI (Upcoming)

- Google Gemini API

---

# 🏗 System Architecture

```
                 React + Vite
                      │
                      │
                   Axios
                      │
                      ▼
                 FastAPI Server
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
 PostgreSQL (Neon)         Google Gemini AI
         │                         │
         └────────────┬────────────┘
                      ▼
                 OfferPrep Platform
```

---

# 📌 Project Status

## ✅ Completed

- Authentication
- JWT
- Dashboard
- Protected Routes
- PostgreSQL Integration
- React Frontend
- FastAPI Backend

---

## 🚧 In Progress

- Resume Module

---

## 📅 Next Milestone

- Resume Upload
- Resume Parsing
- AI Interview
- ML Integration
---

# 📂 Project Structure

```
OfferPrep
│
├── client
│   ├── public
│   ├── src
│   │   ├── api
│   │   │   └── api.js
│   │   │
│   │   ├── components
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server
│   ├── alembic
│   ├── app
│   │   ├── core
│   │   │   ├── config.py
│   │   │   ├── dependencies.py
│   │   │   └── security.py
│   │   │
│   │   ├── database
│   │   │   ├── database.py
│   │   │   └── dependencies.py
│   │   │
│   │   ├── models
│   │   │   └── user.py
│   │   │
│   │   ├── routers
│   │   │   └── auth.py
│   │   │
│   │   ├── schemas
│   │   │   └── user.py
│   │   │
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── README.md
└── .gitignore
```

---

# 🚀 Getting Started

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/OfferPrep.git

cd OfferPrep
```

---

# 💻 Frontend Setup

Navigate to the client folder

```bash
cd client
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Frontend will start at

```
http://localhost:5173
```

---

# ⚙ Backend Setup

Navigate to the server folder

```bash
cd server
```

Create virtual environment

```bash
python -m venv venv
```

---

Activate virtual environment

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

---

Install Python packages

```bash
pip install -r requirements.txt
```

---

Run FastAPI

```bash
uvicorn app.main:app --reload
```

Backend runs at

```
http://127.0.0.1:8000
```

Swagger Documentation

```
http://127.0.0.1:8000/docs
```

---

# 🗄 Database Setup

OfferPrep uses

- PostgreSQL
- Neon Database

Create a PostgreSQL database on Neon.

Copy the connection string.

Update your `.env`

```env
DATABASE_URL=postgresql://username:password@host/database
```

Run migrations

```bash
alembic upgrade head
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `server` directory.

```env
APP_NAME=OfferPrep API

APP_VERSION=1.0.0

DATABASE_URL=YOUR_DATABASE_URL

JWT_SECRET=YOUR_SECRET_KEY

GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

---

# 🌐 Frontend API Configuration

Inside

```
client/src/api/api.js
```

Configure the backend URL.

```javascript
baseURL: "http://127.0.0.1:8000"
```

For production, replace it with your deployed backend URL.

---

# 📦 Required Packages

## Frontend

```
react
react-router-dom
axios
tailwindcss
vite
```

---

## Backend

```
fastapi
uvicorn
sqlalchemy
alembic
psycopg2-binary
passlib[bcrypt]
python-jose[cryptography]
python-dotenv
email-validator
pydantic
pydantic-settings
```

---

# ▶ Running the Complete Project

### Terminal 1

```text
Folder

OfferPrep/server
```

Run

```bash
uvicorn app.main:app --reload
```

---

### Terminal 2

```text
Folder

OfferPrep/client
```

Run

```bash
npm run dev
```

---

Open

```
Frontend

http://localhost:5173
```

Backend

```
http://127.0.0.1:8000
```

Swagger

```
http://127.0.0.1:8000/docs
```

---

# 📸 Screenshots

## 🔐 Authentication Flow

<p align="center">
  <img src="assets/screenshots/authentication.png" alt="Authentication Flow" width="900">
</p>

---

## 📝 Register Page

<p align="center">
  <img src="assets/screenshots/register.png" alt="Register Page" width="900">
</p>

---

## 🔑 Login Page

<p align="center">
  <img src="assets/screenshots/login.png" alt="Login Page" width="900">
</p>

---

## 📊 Dashboard

<p align="center">
  <img src="assets/screenshots/dashboard.png" alt="Dashboard" width="900">
</p>

---

## 🛡 JWT Authentication

<p align="center">
  <img src="assets/screenshots/jwt.png" alt="JWT Authentication" width="900">
</p>

# 📡 API Documentation

## Base URL

```
http://127.0.0.1:8000
```

---

# 🔐 Authentication APIs

## 1. Register User

### Endpoint

```http
POST /auth/register
```

### Request Body

```json
{
    "name": "Aviral",
    "email": "aviral@gmail.com",
    "password": "123456"
}
```

### Success Response

```json
{
    "message": "User Registered Successfully"
}
```

### Error Response

```json
{
    "detail": "Email already registered"
}
```

Status Code

```
200 OK
400 Bad Request
```

---

## 2. Login User

### Endpoint

```http
POST /auth/login
```

### Request Body

```json
{
    "email": "aviral@gmail.com",
    "password": "123456"
}
```

### Success Response

```json
{
    "access_token": "JWT_TOKEN",
    "token_type": "bearer"
}
```

### Error Responses

Wrong Password

```json
{
    "detail": "Invalid password"
}
```

User Not Found

```json
{
    "detail": "User not found"
}
```

Status Code

```
200 OK
401 Unauthorized
404 Not Found
```

---

## 3. Get Logged-in User

### Endpoint

```http
GET /auth/profile
```

### Authorization

```
Bearer Token Required
```

### Success Response

```json
{
    "name": "Aviral",
    "email": "aviral@gmail.com"
}
```

### Error Response

```json
{
    "detail": "Invalid token"
}
```

Status Code

```
200 OK
401 Unauthorized
```

---

# 🔐 Authentication Flow

```text
User Registration
        │
        ▼
Password Hashing (bcrypt)
        │
        ▼
Store User in PostgreSQL
        │
        ▼
User Login
        │
        ▼
Verify Password
        │
        ▼
Generate JWT Token
        │
        ▼
Store Token in Browser
        │
        ▼
Protected Routes
        │
        ▼
Dashboard
```

---

# 🔄 JWT Authentication Flow

```text
React Login Page
        │
        ▼
POST /auth/login
        │
        ▼
FastAPI
        │
        ▼
Generate JWT
        │
        ▼
Browser Local Storage
        │
        ▼
Axios Interceptor
        │
        ▼
Authorization Header
        │
        ▼
Protected APIs
```

---

# 🗄 Database Schema

## Users Table

| Column | Type | Description |
|----------|---------|----------------------------|
| id | Integer | Primary Key |
| name | String | User Name |
| email | String | Unique Email |
| password | String | Hashed Password |

---

# 🧠 Authentication Architecture

```
React
    │
    ▼
Axios
    │
    ▼
FastAPI Router
    │
    ▼
JWT Verification
    │
    ▼
Database
    │
    ▼
Return User
```

---

# 🔒 Security Features

✔ Password Hashing using bcrypt

✔ JWT Authentication

✔ Protected Routes

✔ Duplicate Email Validation

✔ Email Validation

✔ Password Never Stored in Plain Text

✔ Secure Environment Variables

✔ Backend Authentication Middleware

---

# 📊 HTTP Status Codes

| Code | Meaning |
|------|------------------------|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Resource Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

# 🧪 Testing Checklist

## Authentication

- [x] Register User
- [x] Login User
- [x] Password Hashing
- [x] JWT Generation
- [x] Protected Route
- [x] Dashboard Authentication
- [x] Logout
- [x] Duplicate Email Validation
- [x] Invalid Email Validation

---

# 📈 Current Progress

## ✅ Completed

- Authentication Module
- JWT Authentication
- Dashboard
- PostgreSQL Integration
- React Frontend
- FastAPI Backend

---

## 🚧 Under Development

- Resume Module
- Resume Upload
- Resume Parsing
- AI Interview Engine

---

# 🗺 Development Roadmap

OfferPrep is being developed in multiple phases to ensure a scalable and maintainable architecture.

| Phase | Status |
|-------|--------|
| ✅ Phase 1 - Authentication & Dashboard | Completed |
| 🚧 Phase 2 - Resume Upload | In Progress |
| ⏳ Phase 3 - Resume Parsing | Planned |
| ⏳ Phase 4 - AI Interview Generation | Planned |
| ⏳ Phase 5 - AI Feedback & Scoring | Planned |
| ⏳ Phase 6 - Interview History & Analytics | Planned |
| ⏳ Phase 7 - Deployment | Planned |

---

# 🚀 Upcoming Features

### 📄 Resume Module

- Upload Resume (PDF)
- Resume Storage
- Resume Management

---

### 🤖 AI Resume Parser

- Extract Skills
- Extract Experience
- Extract Education
- Extract Projects
- Extract Certifications

---

### 🎤 AI Mock Interview

- Generate Questions
- Technical Interviews
- HR Interviews
- Behavioral Questions
- Company Specific Interviews

---

### 📈 Analytics

- Interview History
- Performance Dashboard
- Skill Progress
- Improvement Suggestions

---

### 👤 User Profile

- Profile Management
- Change Password
- Update Resume
- Account Settings

---

# 🎯 Project Goals

The primary objective of OfferPrep is to provide a complete interview preparation platform where users can:

- Securely create an account
- Upload and manage resumes
- Practice AI-generated interviews
- Receive personalized interview feedback
- Track interview performance over time
- Improve technical and behavioral interview skills

---

# 📌 Challenges Solved

During the development of OfferPrep, the following engineering challenges were addressed:

- JWT Authentication
- Password Hashing using bcrypt
- Secure Route Protection
- React–FastAPI Integration
- CORS Configuration
- PostgreSQL Database Integration
- Axios Interceptors for Authorization
- Environment Variable Management
- Database Migrations using Alembic

---

# 🏆 Learning Outcomes

This project strengthened practical knowledge in:

### Frontend

- React
- React Router
- Axios
- Tailwind CSS
- Component-based Architecture

---

### Backend

- FastAPI
- REST API Design
- JWT Authentication
- Password Security
- SQLAlchemy ORM
- Dependency Injection

---

### Database

- PostgreSQL
- Neon Database
- Alembic Migrations

---

### Software Engineering

- Folder Structure
- Authentication Flow
- API Design
- Git Workflow
- Scalable Project Architecture

---

# 🤝 Contributing

Contributions are welcome!

If you would like to improve OfferPrep:

1. Fork the repository

2. Create a new branch

```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes

```bash
git commit -m "Add your feature"
```

4. Push your branch

```bash
git push origin feature/your-feature-name
```

5. Open a Pull Request

---

# 📝 License

This project is licensed under the MIT License.

Feel free to use this project for learning and educational purposes.

---

# 👨‍💻 Author

**Aviral Mishra**

B.Tech CSE (AI & ML)

GL Bajaj Group of Institutions, Mathura

GitHub:
https://github.com/AviralMishra1310

LinkedIn:
(Add your LinkedIn profile link here)

---

# ⭐ Support

If you found this project useful:

⭐ Star this repository

🍴 Fork the repository

📢 Share it with others

---

# 📬 Contact

For suggestions, feedback, or collaboration:

📧 Email: aviralmishra131005@gmail.com

💼 LinkedIn: https://www.linkedin.com/in/aviral-mishra-7b6073346/

🐙 GitHub: https://github.com/AviralMishra1310

---

<div align="center">

## 🚀 Thank You for Visiting OfferPrep

**Built with ❤️ using React, FastAPI, PostgreSQL & AI**

### Happy Coding! 💙

</div>