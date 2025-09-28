import { useEffect, useState } from "react";
import AddTodoForm from "../components/AddTodoForm";
import TodoItem from "../components/TodoItem";
import { motion } from "framer-motion";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:4000/api/todo"
    : "/api/todo";

const TodoListPage = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTodos = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_URL}?status=${filter}`);
      // Defensive: ensure todos is always an array
      setTodos(Array.isArray(res.data.todos) ? res.data.todos : []);
    } catch (err) {
      setError("Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line
  }, [filter]);

  const handleAdd = async ({ title, description }) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(API_URL, { title, description });
      // Defensive: only add if todo is valid
      if (res.data && res.data.todo && res.data.todo._id) {
        setTodos((prev) => [res.data.todo, ...prev]);
      }
    } catch (err) {
      setError("Failed to add todo");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.patch(`${API_URL}/${id}/status`, { status });
      setTodos((prev) =>
        Array.isArray(prev)
          ? prev.map((todo) => (todo && todo._id === id ? res.data.todo : todo))
          : []
      );
    } catch (err) {
      setError("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl w-full mx-auto mt-10 p-6 bg-gray-900 bg-opacity-80 rounded-xl shadow-2xl border border-gray-800"
    >
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
        My Tasks
      </h2>
      <div className="flex gap-4 mb-6 justify-center">
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === "pending"
              ? "bg-green-500 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-green-600"
          }`}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === "completed"
              ? "bg-emerald-500 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-emerald-600"
          }`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === "deleted"
              ? "bg-red-500 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-red-600"
          }`}
          onClick={() => setFilter("deleted")}
        >
          Deleted
        </button>
      </div>
      <AddTodoForm onAdd={handleAdd} isLoading={loading} />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <div className="text-center text-green-400">Loading...</div>
      ) : !Array.isArray(todos) || todos.length === 0 ? (
        <div className="text-center text-gray-400">No tasks found.</div>
      ) : (
        <div className="space-y-4">
          {todos
            .filter((todo) => todo && todo._id)
            .map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onStatusChange={handleStatusChange}
              />
            ))}
        </div>
      )}
    </motion.div>
  );
};

export default TodoListPage;
