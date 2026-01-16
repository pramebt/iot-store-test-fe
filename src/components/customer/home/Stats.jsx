import { Package, Users, ShoppingBag, TrendingUp } from 'lucide-react';

export default function Stats() {
  const stats = [
    {
      icon: Package,
      value: '1000+',
      label: 'Products',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Users,
      value: '5000+',
      label: 'Happy Customers',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: ShoppingBag,
      value: '10000+',
      label: 'Orders Delivered',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: TrendingUp,
      value: '95%',
      label: 'Satisfaction Rate',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 mb-4">
                  <Icon className="w-7 h-7 text-gray-700" />
                </div>
                <div className="text-4xl font-semibold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
