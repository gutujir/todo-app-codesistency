# Frontend – TodoPro (MERN Todo App)

This is the frontend for the TodoPro MERN stack application. It provides a modern, responsive UI for authentication, email verification, password reset, and todo management.

---

## Features

- Beautiful, responsive UI (Tailwind CSS)
- User registration, login, logout
- Email verification and resend
- Password reset via code (no reset link)
- Protected routes (Zustand state management)
- CRUD for todos (add, edit, delete, mark complete)
- User feedback with toasts and spinners

---

## Tech Stack

- React 19
- Vite
- Zustand (state management)
- Axios (API calls)
- Tailwind CSS
- Lucide React Icons
- React Router DOM

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:4000
```

### 3. Start the dev server

```bash
npm run dev
```

---

## Folder Structure

- `src/components/` – Reusable UI components
- `src/pages/` – App pages (auth, dashboard, todos, etc.)
- `src/store/` – Zustand store for auth and state
- `src/utils/` – Utility functions

---

## Environment Variables

- `VITE_API_URL` – Backend API base URL (e.g., http://localhost:4000)

---

## Deployment

- Build for production: `npm run build`
- The backend will serve the frontend build in production mode.

---

## License

MIT
