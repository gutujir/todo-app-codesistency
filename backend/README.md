# Todo App Backend

This is the backend API for the Todo App, built with Node.js, Express, and MongoDB. It provides secure RESTful endpoints for user authentication, todo management, and email verification using Resend.

---

## Table of Contents

- [Todo App Backend](#todo-app-backend)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Setup \& Installation](#setup--installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
  - [Testing](#testing)
  - [API Endpoints](#api-endpoints)
    - [Auth](#auth)
    - [Todos](#todos)
  - [Testing Endpoints with Postman](#testing-endpoints-with-postman)
    - [1. Register a New User](#1-register-a-new-user)
    - [2. Login](#2-login)
    - [3. Verify Email](#3-verify-email)
    - [4. Resend Verification Email](#4-resend-verification-email)
    - [5. Forgot Password](#5-forgot-password)
    - [6. Reset Password by Code](#6-reset-password-by-code)
    - [7. Get Authenticated User](#7-get-authenticated-user)
    - [8. Create a Todo](#8-create-a-todo)
    - [9. List Todos](#9-list-todos)
    - [10. Get Single Todo](#10-get-single-todo)
    - [11. Edit a Todo](#11-edit-a-todo)
    - [12. Change Todo Status](#12-change-todo-status)
    - [13. Delete a Todo (Soft Delete)](#13-delete-a-todo-soft-delete)
  - [License](#license)

---

## Features

- User authentication (signup, login, logout, JWT cookies)
- Email verification and password reset (Resend integration)
- Todo CRUD (create, edit, complete, delete, list)
- Secure route protection (JWT middleware)
- Professional test suite (Jest, Supertest, mongodb-memory-server)

---

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT
- Resend (email service)
- Jest, Supertest

---

## Setup & Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/gutujir/todo-app-codesistency.git
   cd todo-app-codesistency/backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the backend directory (see below).

---

## Environment Variables

Create a `.env` file in the backend directory with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
RESEND_API_KEY=your_resend_api_key
```

---

## Running the Server

Start the development server:

```sh
npm run dev
```

The server will run on `http://localhost:5000` by default.

---

## Testing

Run backend tests:

```sh
npm test
```

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

## Testing Endpoints with Postman

You can use [Postman](https://www.postman.com/) to test the API endpoints. Below are example requests for common operations, based on the actual controller logic.

### 1. Register a New User

**POST** `http://localhost:5000/api/auth/signup`

**Body (JSON):**

```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "John Doe"
}
```

### 2. Login

**POST** `http://localhost:5000/api/auth/login`

**Body (JSON):**

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### 3. Verify Email

**POST** `http://localhost:5000/api/auth/verify-email`

**Body (JSON):**

```json
{
  "verificationCode": "123456"
}
```

### 4. Resend Verification Email

**POST** `http://localhost:5000/api/auth/resend-verification`

**Body (JSON):**

```json
{
  "email": "user@example.com"
}
```

### 5. Forgot Password

**POST** `http://localhost:5000/api/auth/forgot-password`

**Body (JSON):**

```json
{
  "email": "user@example.com"
}
```

### 6. Reset Password by Code

**POST** `http://localhost:5000/api/auth/reset-password-by-code`

**Body (JSON):**

```json
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "NewPassword123!"
}
```

### 7. Get Authenticated User

**GET** `http://localhost:5000/api/auth/check-auth`

**Headers:**

- Cookie: token=<your_jwt_token>

---

### 8. Create a Todo

**POST** `http://localhost:5000/api/todos`

**Headers:**

- Cookie: token=<your_jwt_token>

**Body (JSON):**

```json
{
  "title": "Buy groceries",
  "description": "Milk, Bread, Eggs"
}
```

### 9. List Todos

**GET** `http://localhost:5000/api/todos`

**Headers:**

- Cookie: token=<your_jwt_token>

**Query (optional):**

- `status=pending` or `status=completed` or `status=deleted`

### 10. Get Single Todo

**GET** `http://localhost:5000/api/todos/<todo_id>`

**Headers:**

- Cookie: token=<your_jwt_token>

### 11. Edit a Todo

**PATCH** `http://localhost:5000/api/todos/<todo_id>`

**Headers:**

- Cookie: token=<your_jwt_token>

**Body (JSON):**

```json
{
  "title": "Buy groceries and fruits",
  "description": "Milk, Bread, Eggs, Apples"
}
```

### 12. Change Todo Status

**PATCH** `http://localhost:5000/api/todos/<todo_id>/status`

**Headers:**

- Cookie: token=<your_jwt_token>

**Body (JSON):**

```json
{
  "status": "completed"
}
```

Valid status values: `pending`, `completed`, `deleted`

### 13. Delete a Todo (Soft Delete)

**DELETE** `http://localhost:5000/api/todos/<todo_id>`

**Headers:**

- Cookie: token=<your_jwt_token>

---

## License

This project is licensed under the MIT License.
