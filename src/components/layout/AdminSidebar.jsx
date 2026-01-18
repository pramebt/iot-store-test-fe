import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  BarChart3,
  Users,
  Store,
  MapPin,
  X
} from 'lucide-react'

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation()

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
      path: '/admin/customers',
      icon: Users,
      label: 'Customers',
    },
    {
      path: '/admin/sales-locations',
      icon: Store,
      label: 'Sales Locations',
    },
    {
      path: '/admin/delivery-addresses',
      icon: MapPin,
      label: 'Delivery Addresses',
    },
  ]

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200 
        flex flex-col transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-gray-200">
          <Link to="/admin" className="flex items-center space-x-2 group" onClick={onClose}>
            <div className="w-7 h-7 bg-linear-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold text-xs">IoT</span>
            </div>
            <span className="text-base font-medium text-gray-900 group-hover:text-gray-600 transition-colors">IoT Store</span>
          </Link>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`
                flex items-center space-x-3 px-3 py-2 rounded-lg transition-all
                ${active 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500'}`} />
              <span className={`text-sm ${active ? 'font-medium text-white' : 'text-gray-700'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-linear-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-medium">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
            <p className="text-[10px] text-gray-500 truncate">admin@iotstore.com</p>
          </div>
        </div>
      </div>
    </aside>
    </>
  )
}
