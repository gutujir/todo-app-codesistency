# Todo App Frontend

This is the frontend for the Todo App, built with React, Vite, and Tailwind CSS. It provides a modern, responsive user interface for managing todos, user authentication, and email verification.

---

## Table of Contents

- [Todo App Frontend](#todo-app-frontend)
  - [Table of Contents](#table-of-contents)
  - [About](#about)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Setup \& Installation](#setup--installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
  - [Testing](#testing)
  - [License](#license)

---

## About

This frontend connects to the Todo App backend API and allows users to:

- Register, login, and verify their email
- Create, edit, complete, and delete todos
- View todos in a beautiful, responsive dashboard

---

## Features

- User authentication (signup, login, logout)
- Email verification and password reset
- Todo CRUD (create, edit, complete, delete, list)
- Protected dashboard and routes
- Password strength meter
- Loading and error states
- Responsive, modern UI (Tailwind CSS)

---

## Tech Stack

- React
- Vite
- Tailwind CSS
- Axios

---

## Project Structure

```
frontend/
├── public/
│   └── screenshot-for-readme.png
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── todo/
│   ├── store/
│   ├── utils/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env
```

---

## Setup & Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/gutujir/todo-app-codesistency.git
   cd todo-app-codesistency/frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the frontend directory (see below).

---

## Environment Variables

Create a `.env` file in the frontend directory with the following:

```env
VITE_API_URL=http://localhost:5000
```

Set this to your backend API URL if deploying.

---

## Running the App

Start the development server:

```sh
npm run dev
```

The app will be available at `http://localhost:5173` by default.

---

## Testing

If you add tests, run them with:

```sh
npm test
```

---

## License

This project is licensed under the MIT License.
