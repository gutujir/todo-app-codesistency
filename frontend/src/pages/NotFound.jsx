const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl px-10 py-12 flex flex-col items-center">
      <h1 className="text-7xl font-extrabold text-green-400 mb-4 drop-shadow-lg">
        404
      </h1>
      <p className="text-2xl font-semibold text-white mb-2">Page Not Found</p>
      <p className="text-lg text-gray-200 mb-8 max-w-xs text-center">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow transition-colors text-lg"
      >
        Go Home
      </a>
    </div>
  </div>
);

export default NotFound;
