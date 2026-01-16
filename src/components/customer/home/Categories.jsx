import { Link } from 'react-router-dom';
import { Smartphone, Laptop, Watch, Headphones, Camera, Home } from 'lucide-react';
import Card from '../../common/Card';

export default function Categories() {
  const categories = [
    {
      name: 'Smartphones',
      icon: Smartphone,
      count: 150,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Laptops',
      icon: Laptop,
      count: 80,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Smartwatches',
      icon: Watch,
      count: 120,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Audio',
      icon: Headphones,
      count: 200,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      name: 'Cameras',
      icon: Camera,
      count: 60,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      name: 'Smart Home',
      icon: Home,
      count: 90,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-semibold text-center mb-16 text-gray-900">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link key={index} to={`/products?category=${category.name}`}>
                <div className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-all cursor-pointer group">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                      <Icon className="w-6 h-6 text-gray-700" />
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1 text-sm">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.count} items</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
