import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold text-sm">IoT</span>
            </div>
            <span className="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors">IoT Store</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-5">
            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'ADMIN' && (
                  <Link 
                    to="/admin" 
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-gray-900 text-white text-sm px-4 py-1.5 rounded-full hover:bg-gray-800 transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
