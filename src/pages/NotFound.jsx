import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center">
        <h1 className="text-9xl font-semibold text-gray-900 mb-4">404</h1>
        <p className="text-2xl text-gray-500 mb-8">Page not found</p>
        <p className="text-gray-400 mb-12 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <button className="bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all">
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
}
