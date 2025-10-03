# Todo App

> **Notice:**
> The app is deployed on [Render](https://render.com/).
>
> [Deployed App url](https://todo-app-codesistency.onrender.com)
>
> Email verification functionality is handled on the backend for account verification and password reset processes. However, due to domain-related issues, these features may not function correctly on the deployed app. For testing purposes, you can configure the Resend email service locally to ensure the functionality works as expected.

## About the project

A full-stack Todo application with authentication, email verification, and a modern UI. Built with Node.js/Express (backend) and React (frontend), styled using Tailwind CSS, and featuring Resend for transactional emails.

---

## Table of Contents

- [Todo App](#todo-app)
  - [About the project](#about-the-project)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [Backend (Node.js/Express)](#backend-nodejsexpress)
    - [Frontend (React/Vite)](#frontend-reactvite)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Resend Email Configuration](#resend-email-configuration)
  - [API Endpoints](#api-endpoints)
    - [Auth](#auth)
    - [Todos](#todos)
  - [Testing](#testing)
  - [License](#license)
  - [Author](#author)
  - [Acknowledgements](#acknowledgements)

## Features

### Backend (Node.js/Express)

- User authentication (signup, login, logout, JWT cookies)
- Email verification and password reset (Resend integration)
- Todo CRUD (create, edit, complete, delete, list)
- Secure route protection (JWT middleware)
- Professional test suite (Jest, Supertest, mongodb-memory-server)

### Frontend (React/Vite)

- User signup, login, and dashboard
- Todo creation, editing, completion, and deletion
- Public landing page and protected dashboard
- Responsive, modern UI (Tailwind CSS)

---

## Project Structure

```
todo-app-codesistency/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── index.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── resend/
│   │   ├── routes/
│   │   └── utils/
│   ├── tests/
│   ├── package.json
│   ├── jest.config.js
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or Atlas, or use in-memory for tests)

---

## Backend Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/gutujir/todo-app-codesistency.git
   cd todo-app-codesistency/backend
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `backend/` directory:

   ```env
   PORT=5000
   MONGO_URI=your mongodb connection string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   RESEND_API_KEY=your_resend_api_key
   ```

   - `RESEND_API_KEY`: Get from https://resend.com/

4. **Run the backend server:**

   ```sh
   npm run dev
   ```

   The server will start on `http://localhost:5000` by default.

5. **Run backend tests:**
   ```sh
   npm test
   ```

---

## Frontend Setup

1. **Navigate to the frontend directory:**

   ```sh
   cd ../frontend
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `frontend/` directory:

   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Run the frontend app:**
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

---

## Resend Email Configuration

- **Sign up at [Resend](https://resend.com/)** and obtain your API key.
- **Add your sender email** in the Resend dashboard and verify it.
- \*\*Set `RESEND_API_KEY` in your backend `.env`.
- **Note:** On the deployed app (Render), Resend email sending is restricted due to domain verification issues. You can only send emails to your own (verified) email address. For full email functionality, use the app locally or ensure your domain is verified with Resend.

---

## API Endpoints

### Auth

- `POST /api/auth/signup` — Register new user
- `POST /api/auth/login` — Login
- `POST /api/auth/verify-email` — Verify email with code
- `POST /api/auth/resend-verification` — Resend verification email
- `POST /api/auth/forgot-password` — Request password reset
- `POST /api/auth/reset-password-by-code` — Reset password
- `POST /api/auth/logout` — Logout
- `GET /api/auth/check-auth` — Check authentication

### Todos

- `GET /api/todos` — List all todos (auth required)
- `POST /api/todos` — Create todo (auth required)
- `PATCH /api/todos/:id` — Edit todo (auth required)
- `PATCH /api/todos/:id/complete` — Mark todo as complete (auth required)
- `DELETE /api/todos/:id` — Delete todo (auth required)

---

## Testing

- Backend: `npm test` (Jest, Supertest, in-memory MongoDB)
- Utilities, models, controllers, routes, and middleware are all covered.

---

## License

This project is licensed under the MIT License.

---

## Author

- [Gutu Jirata Imana]
- [Portfolio](https://gutu-portfolio-2.vercel.app/)

---

## Acknowledgements

- [Resend](https://resend.com/) for transactional email
- [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/)
- [Express](https://expressjs.com/), [React](https://react.dev/), [Vite](https://vitejs.dev/)
- [Jest](https://jestjs.io/), [Supertest](https://github.com/ladjs/supertest)
- [Tailwind CSS](https://tailwindcss.com/)
