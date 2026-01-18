import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedAdminRoute from './components/auth/ProtectedAdminRoute';
import HomePage from './pages/customer/HomePage';
import ProductsPage from './pages/customer/ProductsPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrdersPage from './pages/customer/OrdersPage';
import CustomerOrderDetailPage from './pages/customer/CustomerOrderDetailPage';
import ProfilePage from './pages/customer/ProfilePage';
import About from './pages/About';
import Contact from './pages/Contact';
import LoginPage from './pages/auth/LoginPage';
import LoginLoadingPage from './pages/auth/LoginLoadingPage';
import RegisterPage from './pages/auth/RegisterPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsManagementPage from './pages/admin/ProductsManagementPage';
import CategoriesManagementPage from './pages/admin/CategoriesManagementPage';
import OrdersManagementPage from './pages/admin/OrdersManagementPage';
import OrderDetailPage from './pages/admin/OrderDetailPage';
import CustomersManagementPage from './pages/admin/CustomersManagementPage';
import SalesLocationsManagementPage from './pages/admin/SalesLocationsManagementPage';
import DeliveryAddressesManagementPage from './pages/admin/DeliveryAddressesManagementPage';
import TestAPI from './pages/TestAPI';
import NotFound from './pages/NotFound';
import { ToastContainer } from './components/common/Toast';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Customer Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<CustomerOrderDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/test-api" element={<TestAPI />} />
        </Route>

        {/* Admin Routes with AdminLayout - Protected by Admin Role */}
        <Route element={<ProtectedAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/products" element={<ProductsManagementPage />} />
            <Route path="/admin/categories" element={<CategoriesManagementPage />} />
            <Route path="/admin/orders" element={<OrdersManagementPage />} />
            <Route path="/admin/orders/:id" element={<OrderDetailPage />} />
            <Route path="/admin/customers" element={<CustomersManagementPage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
            <Route path="/admin/sales-locations" element={<SalesLocationsManagementPage />} />
            <Route path="/admin/delivery-addresses" element={<DeliveryAddressesManagementPage />} />
          </Route>
        </Route>

        {/* Routes without Layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login-loading" element={<LoginLoadingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
