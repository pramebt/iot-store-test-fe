import { Link } from 'react-router-dom';
import { Smartphone, Laptop, Watch, Headphones, Camera, Home, ArrowRight, Package } from 'lucide-react';
import { categoriesService } from '../../../services/categories.service';
import { useEffect, useState } from 'react';

const categoryIcons = {
  'Smartphones': Smartphone,
  'Laptops': Laptop,
  'Smartwatches': Watch,
  'Audio': Headphones,
  'Cameras': Camera,
  'Smart Home': Home,
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      const activeCategories = (Array.isArray(data) ? data : [])
        .filter(cat => cat.status === 'Active')
        .slice(0, 6);
      setCategories(activeCategories);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center text-gray-400">Loading categories...</div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
            Explore our curated collection of premium products
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category) => {
            const Icon = categoryIcons[category.name] || Package;
            const productCount = category._count?.products || 0;
            
            return (
              <Link 
                key={category.id} 
                to={`/products?category=${category.id}`}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 h-full flex flex-col items-center justify-center">
                  <div className="flex justify-center mb-5">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-gray-100 transition-colors duration-300">
                      <Icon className="w-7 h-7 text-gray-700 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1.5 text-sm sm:text-base group-hover:text-gray-700 transition-colors">
                    {category.name}
                  </h3>
                  {productCount > 0 && (
                    <p className="text-xs text-gray-500">{productCount} {productCount === 1 ? 'product' : 'products'}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
