import { Truck, Shield, CreditCard, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Features() {
  const features = [
    {
      icon: Truck,
      title: 'จัดส่งฟรี',
      description: 'จัดส่งฟรีเมื่อสั่งซื้อสินค้าครบ 3,000 บาท',
    },
    {
      icon: Shield,
      title: 'ชำระเงินปลอดภัย',
      description: 'ระบบชำระเงินที่ปลอดภัย 100%',
    },
    {
      icon: CreditCard,
      title: 'คืนสินค้าง่าย',
      description: 'รับประกันคืนเงินภายใน 30 วัน',
    },
    {
      icon: Headphones,
      title: 'บริการ 24/7',
      description: 'ทีมงานพร้อมให้บริการตลอด 24 ชั่วโมง',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-gray-900 mb-4">
            ทำไมต้องเลือกเรา?
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
            สัมผัสความแตกต่างด้วยความมุ่งมั่นในการให้บริการที่ดีที่สุด
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 group"
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-center mb-6">
                  <motion.div 
                    className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-gray-100 transition-colors duration-300"
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-7 h-7 text-gray-700 group-hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed font-light">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
