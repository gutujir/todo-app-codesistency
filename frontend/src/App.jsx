import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import TodoListPage from "./pages/TodoListPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import EnterResetCodePage from "./pages/EnterResetCodePage";
import LandingPage from "./pages/LandingPage";

import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
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
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 shadow-lg z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-extrabold text-green-400 tracking-tight select-none focus:outline-none bg-transparent border-none cursor-pointer"
            style={{ background: "none", border: "none", padding: 0 }}
            aria-label="Go to Dashboard"
          >
            TodoPro
          </button>
        </div>
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-lg font-bold transition-colors px-2 py-1 rounded-lg ${
              location.pathname === "/"
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
              // Show LandingPage for unauthenticated, Dashboard for authenticated
              useAuthStore.getState().isAuthenticated &&
              useAuthStore.getState().user?.isVerified ? (
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              ) : (
                <LandingPage />
              )
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
          <Route path="/verify-email" element={<EmailVerificationPage />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </div>
  );
}

export default App;
