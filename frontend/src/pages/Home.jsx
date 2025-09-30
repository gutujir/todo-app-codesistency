import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 px-4">
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl px-10 py-12 flex flex-col items-center max-w-xl w-full">
      <h1 className="text-4xl md:text-5xl font-extrabold text-green-400 mb-4 drop-shadow-lg text-center">
        Welcome to TodoPro
      </h1>
      <p className="text-lg text-gray-200 mb-6 text-center">
        TodoPro is your all-in-one productivity app to manage your daily tasks,
        stay organized, and achieve your goals efficiently. Create, edit, and
        track your todos with ease.
      </p>
      <div className="mb-8 w-full">
        <h2 className="text-2xl font-bold text-white mb-2">Getting Started</h2>
        <ul className="list-disc list-inside text-gray-100 text-base space-y-1">
          <li>
            Go to{" "}
            <Link
              to="/tasks"
              className="text-green-300 underline hover:text-green-400"
            >
              My Tasks
            </Link>{" "}
            to view and manage your todos.
          </li>
          <li>
            Visit your{" "}
            <Link
              to="/dashboard"
              className="text-green-300 underline hover:text-green-400"
            >
              Dashboard
            </Link>{" "}
            for an overview of your productivity.
          </li>
          <li>Use the navigation bar to access all features.</li>
        </ul>
      </div>
      <div className="flex gap-4">
        <Link
          to="/tasks"
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow transition-colors text-lg"
        >
          My Tasks
        </Link>
        <Link
          to="/"
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow transition-colors text-lg"
        >
          Dashboard
        </Link>
      </div>
    </div>
  </div>
);

export default Home;
