import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import HomePage from './pages/customer/HomePage';
import ProductsPage from './pages/customer/ProductsPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrdersPage from './pages/customer/OrdersPage';
import About from './pages/About';
import Contact from './pages/Contact';
import LoginPage from './pages/auth/LoginPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsManagementPage from './pages/admin/ProductsManagementPage';
import CategoriesManagementPage from './pages/admin/CategoriesManagementPage';
import OrdersManagementPage from './pages/admin/OrdersManagementPage';
import OrderDetailPage from './pages/admin/OrderDetailPage';
import CustomersManagementPage from './pages/admin/CustomersManagementPage';
import TestAPI from './pages/TestAPI';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrdersPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/test-api" element={<TestAPI />} />
        </Route>

        {/* Admin Routes with AdminLayout */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/products" element={<ProductsManagementPage />} />
          <Route path="/admin/categories" element={<CategoriesManagementPage />} />
          <Route path="/admin/orders" element={<OrdersManagementPage />} />
          <Route path="/admin/orders/:id" element={<OrderDetailPage />} />
          <Route path="/admin/customers" element={<CustomersManagementPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
        </Route>

        {/* Routes without Layout */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
