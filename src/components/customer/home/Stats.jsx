import { Package, Users, ShoppingBag, TrendingUp } from 'lucide-react';

export default function Stats() {
  const stats = [
    {
      icon: Package,
      value: '1000+',
      label: 'Products',
    },
    {
      icon: Users,
      value: '5000+',
      label: 'Happy Customers',
    },
    {
      icon: ShoppingBag,
      value: '10000+',
      label: 'Orders Delivered',
    },
    {
      icon: TrendingUp,
      value: '95%',
      label: 'Satisfaction Rate',
    },
  ];

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 mb-6 group-hover:bg-gray-100 transition-colors duration-300">
                  <Icon className="w-7 h-7 text-gray-700" />
                </div>
                <div className="text-4xl md:text-5xl font-semibold text-gray-900 mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
