import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/customer/HomePage';
import ProductsPage from './pages/customer/ProductsPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CartPage from './pages/customer/CartPage';
import OrdersPage from './pages/customer/OrdersPage';
import About from './pages/About';
import Contact from './pages/Contact';
import LoginPage from './pages/auth/LoginPage';
import TestAPI from './pages/TestAPI';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/test-api" element={<TestAPI />} />
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
