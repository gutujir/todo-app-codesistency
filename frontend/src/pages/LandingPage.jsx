import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 px-4 py-10">
      <div className="max-w-2xl w-full bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl border border-gray-800 p-10 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-6 drop-shadow-lg text-center">
          Welcome to TodoPro
        </h1>
        <p className="text-lg text-gray-300 max-w-xl mx-auto text-center mb-8">
          TodoPro is your all-in-one productivity companion. Organize your
          tasks, set priorities, and achieve your goals with a beautiful,
          intuitive interface. Whether you're a student, professional, or just
          want to stay on top of your daily life, TodoPro helps you get things
          done efficiently.
        </p>
        <div className="bg-gray-800 bg-opacity-70 rounded-xl shadow-lg p-8 w-full mb-8">
          <h2 className="text-2xl font-bold text-green-400 mb-4 text-center">
            Why TodoPro?
          </h2>
          <ul className="list-disc list-inside text-gray-200 space-y-2 mx-auto max-w-md">
            <li>📝 Effortless task creation and management</li>
            <li>🔔 Smart reminders so you never miss a deadline</li>
            <li>📅 Organize by projects, priorities, and due dates</li>
            <li>🔒 Secure authentication and privacy-first design</li>
            <li>🌙 Beautiful, responsive UI for all devices</li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-6">
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3 rounded-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:from-green-600 hover:to-emerald-700 text-center transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-3 rounded-lg font-bold bg-gradient-to-r from-emerald-500 to-green-400 text-white shadow-lg hover:from-emerald-600 hover:to-green-500 text-center transition duration-200"
          >
            Sign Up
          </Link>
        </div>
        <footer className="text-gray-500 text-sm mt-4 text-center">
          &copy; {new Date().getFullYear()} TodoPro. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
