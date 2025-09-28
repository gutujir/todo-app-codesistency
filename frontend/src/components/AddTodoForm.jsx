import { useState } from "react";
import { motion } from "framer-motion";
import Input from "./Input";

const AddTodoForm = ({ onAdd, isLoading }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, description });
    setTitle("");
    setDescription("");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-800 bg-opacity-60 rounded-xl p-6 mb-6 shadow-lg"
    >
      <h3 className="text-xl font-bold mb-4 text-green-400">Add New Task</h3>
      <Input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        icon={() => <span className="text-green-400 font-bold">#</span>}
        required
      />
      <Input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        icon={() => <span className="text-green-400 font-bold">...</span>}
      />
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 mt-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
      >
        {isLoading ? "Adding..." : "Add Task"}
      </motion.button>
    </motion.form>
  );
};

export default AddTodoForm;
