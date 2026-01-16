import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  BarChart3,
  User
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      path: '/admin/products',
      icon: Package,
      label: 'Products',
    },
    {
      path: '/admin/categories',
      icon: FolderTree,
      label: 'Categories',
    },
    {
      path: '/admin/orders',
      icon: ShoppingCart,
      label: 'Orders',
    },
    {
      path: '/admin/analytics',
      icon: BarChart3,
      label: 'Analytics',
    },
    {
      path: '/admin/users',
      icon: User,
      label: 'Users',
    },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-3 px-6 py-3 transition-colors
                ${active 
                  ? 'bg-blue-600 text-white border-r-4 border-blue-400' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
