import { motion } from "framer-motion";

const TodoItem = ({ todo, onStatusChange }) => {
  const { _id, title, description, status, createdAt } = todo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-lg shadow border flex flex-col md:flex-row md:items-center justify-between gap-2
        ${
          status === "completed"
            ? "bg-emerald-900 border-emerald-700"
            : status === "deleted"
            ? "bg-red-900 border-red-700"
            : "bg-gray-800 border-gray-700"
        }`}
    >
      <div>
        <h4 className="text-lg font-bold text-green-300 mb-1">{title}</h4>
        {description && <p className="text-gray-300 mb-1">{description}</p>}
        <p className="text-xs text-gray-400">
          Created: {new Date(createdAt).toLocaleString()}
        </p>
      </div>
      <div className="flex gap-2 mt-2 md:mt-0">
        {status !== "completed" && status !== "deleted" && (
          <button
            className="px-3 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600 text-sm font-semibold"
            onClick={() => onStatusChange(_id, "completed")}
          >
            Mark Completed
          </button>
        )}
        {status !== "deleted" && (
          <button
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-semibold"
            onClick={() => onStatusChange(_id, "deleted")}
          >
            Delete
          </button>
        )}
        {status === "deleted" && (
          <span className="text-red-400 font-semibold">Deleted</span>
        )}
        {status === "completed" && (
          <span className="text-emerald-400 font-semibold">Completed</span>
        )}
      </div>
    </motion.div>
  );
};

export default TodoItem;
