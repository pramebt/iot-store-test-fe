import { Truck, Shield, CreditCard, Headphones } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free delivery on orders over $100',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure payment processing',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: CreditCard,
      title: 'Easy Returns',
      description: '30-day money-back guarantee',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Dedicated customer support',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-semibold text-center mb-16 text-gray-900">
          Why Choose IoT Store?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-md transition-all"
              >
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <Icon className="w-7 h-7 text-gray-700" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
