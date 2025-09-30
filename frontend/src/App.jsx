import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";

import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import EmailVerificationPage from "./pages/auth/EmailVerificationPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import TodoListPage from "./pages/todo/TodoListPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import EnterResetCodePage from "./pages/auth/EnterResetCodePage";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  if (!isAuthenticated || !user) return null;
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  const handleLogoClick = () => {
    navigate("/home");
  };
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 shadow-lg z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogoClick}
            className="text-2xl font-extrabold text-green-400 tracking-tight select-none focus:outline-none bg-transparent border-none cursor-pointer"
            style={{ background: "none", border: "none", padding: 0 }}
            aria-label="Go to Home"
          >
            TodoPro
          </button>
        </div>
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/dashboard"
            className={`text-lg font-bold transition-colors px-2 py-1 rounded-lg ${
              location.pathname === "/dashboard"
                ? "bg-green-500 text-white"
                : "text-green-400 hover:bg-green-600 hover:text-white"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/tasks"
            className={`text-lg font-bold transition-colors px-2 py-1 rounded-lg ${
              location.pathname === "/tasks"
                ? "bg-emerald-500 text-white"
                : "text-emerald-400 hover:bg-emerald-600 hover:text-white"
            }`}
          >
            My Tasks
          </Link>
          <span className="text-gray-300 text-sm ml-4">{user.email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow transition-colors"
          >
            Logout
          </button>
        </div>
        {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-lg text-green-400 hover:bg-gray-800 focus:outline-none"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-gray-900 bg-opacity-95 z-50 flex flex-col items-center gap-6 py-8 animate-fade-in">
          <Link
            to="/"
            className={`w-11/12 text-lg font-bold px-4 py-3 rounded-lg text-center transition-colors ${
              location.pathname === "/"
                ? "bg-green-500 text-white"
                : "text-green-400 hover:bg-green-600 hover:text-white"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/tasks"
            className={`w-11/12 text-lg font-bold px-4 py-3 rounded-lg text-center transition-colors ${
              location.pathname === "/tasks"
                ? "bg-emerald-500 text-white"
                : "text-emerald-400 hover:bg-emerald-600 hover:text-white"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            My Tasks
          </Link>
          <span className="text-gray-300 text-base">{user.email}</span>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="w-11/12 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <Navbar />
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      <div className="w-full flex flex-col items-center justify-center pt-20">
        <Routes>
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TodoListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              useAuthStore.getState().isAuthenticated ? (
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              ) : (
                <LandingPage />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />
          {/* <Route path="/verify-email" element={<EmailVerificationPage />} /> */}
          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/enter-reset-code"
            element={
              <RedirectAuthenticatedUser>
                <EnterResetCodePage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </div>
  );
}

export default App;
