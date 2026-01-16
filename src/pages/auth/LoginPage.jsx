import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white font-semibold text-2xl">IoT</span>
          </div>
          <h1 className="text-4xl font-semibold mb-2 text-gray-900">Welcome back</h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@example.com"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-full hover:bg-gray-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-500 mb-2">Demo credentials:</p>
            <p className="text-sm text-gray-700">admin@example.com</p>
            <p className="text-sm text-gray-700">admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
