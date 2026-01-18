import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingCart, User, LogOut, LayoutDashboard, Package, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white/70 backdrop-blur-2xl border-b border-gray-200/50 sticky top-0 z-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group" onClick={closeMobileMenu}>
            <div className="w-10 h-10 bg-linear-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-semibold text-sm tracking-tight">IoT</span>
            </div>
              <span className="text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors tracking-tight hidden sm:block">IoT Store</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-100/50 transition-all duration-200">
              Home
            </Link>
            <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-100/50 transition-all duration-200">
              Products
            </Link>
            <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-100/50 transition-all duration-200">
              About
            </Link>
              <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-100/50 transition-all duration-200">
                Contact
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Cart */}
              <Link 
                to="/cart" 
                className="relative text-gray-600 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-100/50 transition-all duration-200"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Orders - Only show when user is logged in */}
              {user && (
                <Link 
                  to="/orders" 
                  className="text-gray-600 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-100/50 transition-all duration-200"
                  title="My Orders"
                >
                  <Package className="w-5 h-5" />
                </Link>
              )}

              {/* User Menu - Desktop */}
              {user ? (
                <div className="hidden sm:flex items-center space-x-2">
                  {user.role === 'ADMIN' && (
                    <Link 
                      to="/admin" 
                      className="text-gray-600 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-100/50 transition-all duration-200"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                    </Link>
                  )}
                  <Link 
                    to="/profile" 
                    className="text-gray-600 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-100/50 transition-all duration-200"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="hidden sm:block bg-gray-900 text-white text-sm font-semibold px-6 py-2.5 rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                >
                  Login
                </Link>
              )}

              {/* Hamburger Menu Button - Mobile */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-600 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-100/50 transition-all duration-200 relative z-101"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <>
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-90 md:hidden transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={closeMobileMenu}
        />

        {/* Mobile Menu Panel */}
        <div className={`fixed inset-y-0 right-0 w-80 bg-white/95 backdrop-blur-xl border-l border-gray-200/50 shadow-2xl z-100 md:hidden transform transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={closeMobileMenu}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100/50 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                <Link 
                  to="/" 
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all duration-200 font-medium"
                >
                  <span>Home</span>
                </Link>
                <Link 
                  to="/products" 
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all duration-200 font-medium"
                >
                  <span>Products</span>
                </Link>
                <Link 
                  to="/about" 
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all duration-200 font-medium"
                >
                  <span>About</span>
                </Link>
                <Link 
                  to="/contact" 
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all duration-200 font-medium"
                >
                  <span>Contact</span>
                </Link>

                {/* Divider */}
                <div className="border-t border-gray-200/50 my-4"></div>

                {/* Cart - Mobile */}
                <Link 
                  to="/cart" 
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all duration-200 font-medium"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Cart</span>
                  </div>
                  {cartItemsCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>

                {/* Orders - Mobile */}
                {user && (
                  <Link 
                    to="/orders" 
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all duration-200 font-medium"
                  >
                    <Package className="w-5 h-5" />
                    <span>My Orders</span>
                  </Link>
                )}

                {/* User Section - Mobile */}
                {user ? (
                  <>
                    <div className="border-t border-gray-200/50 my-4"></div>
                    <Link 
                      to="/profile" 
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all duration-200 font-medium"
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link 
                        to="/admin" 
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all duration-200 font-medium"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t border-gray-200/50 my-4"></div>
                    <Link 
                      to="/login" 
                      onClick={closeMobileMenu}
                      className="w-full bg-gray-900 text-white text-center font-semibold px-6 py-3 rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                    >
                      Login
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
      </>
    </>
  );
};

export default Header;
