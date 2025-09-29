# Backend – TodoPro (MERN Todo App)

This is the backend API for the TodoPro MERN stack application. It provides authentication, email verification, password reset, and CRUD operations for todos.

---

## Features
- User registration with email verification (Resend API)
- Secure login/logout with JWT & cookies
- Password reset via email code
- Resend verification and reset codes
- CRUD for todos (add, edit, delete, mark complete)
- Professional error handling

---

## Tech Stack
- Node.js
- Express 5
- MongoDB (Mongoose)
- JWT
- Resend (email)
- dotenv, CORS, cookie-parser

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the backend root:
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_api_key
CLIENT_URL=http://localhost:5173
```

### 3. Start the server
```bash
npm run dev
```

---

## API Endpoints

### Auth
- `POST /api/auth/signup` – Register new user
- `POST /api/auth/login` – Login
- `POST /api/auth/logout` – Logout
- `POST /api/auth/verify-email` – Verify email with code
- `POST /api/auth/resend-verification` – Resend verification code
- `POST /api/auth/forgot-password` – Request password reset code
- `POST /api/auth/reset-password-by-code` – Reset password with code
- `GET /api/auth/check-auth` – Check authentication (protected)

### Todos
- `GET /api/todo` – Get all todos (protected)
- `POST /api/todo` – Add todo (protected)
- `PUT /api/todo/:id` – Update todo (protected)
- `DELETE /api/todo/:id` – Delete todo (protected)

---

## Folder Structure
- `controllers/` – Route logic
- `models/` – Mongoose schemas
- `routes/` – Express routes
- `middleware/` – Auth middleware
- `resend/` – Email logic
- `utils/` – Utility functions

---

## Deployment
- The backend serves the frontend build in production mode.
- Set all environment variables in your deployment dashboard.

---

## License
MIT
