import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsService } from '../../../services/products.service';
import { useCartStore } from '../../../store/cartStore';
import Card from '../../common/Card';
import Button from '../../common/Button';
import { formatPrice } from '../../../utils/formatPrice';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.getAll({ limit: 8 });
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    }, 1);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-gray-600">Loading products...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900">Featured Products</h2>
          <Link to="/products">
            <button className="text-gray-900 text-sm px-6 py-2 rounded-full hover:bg-gray-200 transition-all bg-gray-100">
              View All
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const isOutOfStock = product.stock === 0 || product.stock === null || product.stock === undefined;
            
            return (
              <div key={product.id} className={`bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all group relative ${isOutOfStock ? 'opacity-75' : ''}`}>
                {/* Out of Stock Badge */}
                {isOutOfStock && (
                  <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                    Out of Stock
                  </div>
                )}
                
                <Link to={`/products/${product.id}`}>
                  <div className="aspect-square bg-gray-100 overflow-hidden relative">
                    <img
                      src={product.imageUrl || '/placeholder.jpg'}
                      alt={product.name}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${isOutOfStock ? 'grayscale' : ''}`}
                    />
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/20"></div>
                    )}
                  </div>
                </Link>
                <div className="p-5">
                  <Link to={`/products/${product.id}`}>
                    <h3 className={`font-medium mb-2 hover:text-gray-600 transition-colors ${isOutOfStock ? 'text-gray-500' : 'text-gray-900'}`}>
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-xl font-semibold ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}>
                        {formatPrice(product.price)}
                      </span>
                      <div className={`text-xs mt-1 ${isOutOfStock ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                        {isOutOfStock ? 'Out of Stock' : `Stock: ${product.stock}`}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      disabled={isOutOfStock}
                      className="bg-gray-900 text-white text-sm px-4 py-2 rounded-full hover:bg-gray-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {isOutOfStock ? 'Out' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
