import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:4000/api/todo"
    : import.meta.env.VITE_API_URL + "/api/todo";

// Fetch all todos for the dashboard (pending, completed, deleted)
export const fetchAllTodosForDashboard = async () => {
  const statuses = ["pending", "completed", "deleted"];
  const results = await Promise.all(
    statuses.map(async (status) => {
      const res = await axios.get(`${API_URL}?status=${status}`);
      return {
        status,
        todos: Array.isArray(res.data.todos) ? res.data.todos : [],
      };
    })
  );
  // Flatten and tag todos with their status
  return results.flatMap(({ status, todos }) =>
    todos.map((todo) => ({ ...todo, status }))
  );
};
