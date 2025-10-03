import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/date";
import { fetchAllTodosForDashboard } from "../../utils/todoApi";

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchAllTodosForDashboard()
      .then((data) => {
        setTodos(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Metrics (realtime)
  const totalTodos = todos.length;
  const completedTodos = todos.filter((t) => t.status === "completed").length;
  const pendingTodos = todos.filter((t) => t.status === "pending").length;
  const deletedTodos = todos.filter((t) => t.status === "deleted").length;
  const latestTodos = [...todos]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);
  const completionRate = totalTodos
    ? Math.round((completedTodos / totalTodos) * 100)
    : 0;

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-800"
    >
      <h2 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text tracking-tight">
        Dashboard
      </h2>

      {/* User Profile & Account Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          className="p-5 bg-gray-800 bg-opacity-60 rounded-xl border border-gray-700 shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-bold text-green-400 mb-2">Profile</h3>
          <p className="text-gray-200 font-semibold">{user.name}</p>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </motion.div>
        <motion.div
          className="p-5 bg-gray-800 bg-opacity-60 rounded-xl border border-gray-700 shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-green-400 mb-2">
            Account Activity
          </h3>
          <p className="text-gray-300 text-sm">
            <span className="font-semibold">Joined:</span>{" "}
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-gray-300 text-sm">
            <span className="font-semibold">Last Login:</span>{" "}
            {formatDate(user.lastLogin)}
          </p>
        </motion.div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 flex flex-col items-center shadow-lg">
          <span className="text-3xl font-bold text-white">{totalTodos}</span>
          <span className="text-gray-100 mt-1">Total Todos</span>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-green-400 rounded-xl p-5 flex flex-col items-center shadow-lg">
          <span className="text-3xl font-bold text-white">
            {completedTodos}
          </span>
          <span className="text-gray-100 mt-1">Completed</span>
        </div>
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-5 flex flex-col items-center shadow-lg">
          <span className="text-3xl font-bold text-white">{pendingTodos}</span>
          <span className="text-gray-100 mt-1">Pending</span>
        </div>
        <div className="bg-gradient-to-br from-red-400 to-rose-500 rounded-xl p-5 flex flex-col items-center shadow-lg">
          <span className="text-3xl font-bold text-white">{deletedTodos}</span>
          <span className="text-gray-100 mt-1">Deleted</span>
        </div>
      </div>

      {/* Productivity Rate */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-200 font-semibold">Productivity Rate</span>
          <span className="text-green-400 font-bold">{completionRate}%</span>
        </div>
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Latest Todos */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-green-400 mb-3">Latest Todos</h3>
        {loading ? (
          <div className="text-gray-400">Loading latest todos...</div>
        ) : latestTodos.length === 0 ? (
          <div className="text-gray-400">No todos found.</div>
        ) : (
          <ul className="space-y-3">
            {latestTodos.map((todo) => (
              <li
                key={todo._id}
                className="p-4 bg-gray-800 bg-opacity-60 rounded-lg border border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <span
                    className={`font-semibold ${
                      todo.status === "completed"
                        ? "text-green-300"
                        : todo.status === "deleted"
                        ? "text-red-400"
                        : "text-yellow-300"
                    }`}
                  >
                    {todo.title}
                  </span>
                  <span className="ml-2 text-xs text-gray-400">
                    {todo.status === "completed"
                      ? "(Completed)"
                      : todo.status === "deleted"
                      ? "(Deleted)"
                      : "(Pending)"}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1 md:mt-0 md:ml-4">
                  Updated: {formatDate(todo.updatedAt)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <Link
          to="/tasks"
          className="flex-1 py-3 px-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold rounded-lg shadow-lg text-center hover:from-green-500 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
        >
          Go to My Tasks
        </Link>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Logout
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
