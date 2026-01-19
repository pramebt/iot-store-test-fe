import { Link } from 'react-router-dom';
import { Smartphone, Laptop, Watch, Headphones, Camera, Home, ArrowRight, Package } from 'lucide-react';
import { categoriesService } from '../../../services/categories.service';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
          <div className="text-center text-gray-400">กำลังโหลดหมวดหมู่...</div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
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
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-gray-900 mb-2 sm:mb-3 md:mb-4 px-4">
            เลือกซื้อตามหมวดหมู่
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 font-light max-w-2xl mx-auto px-4">
            สำรวจสินค้าคุณภาพสูงที่คัดสรรมาอย่างดี
          </p>
        </motion.div>

        {/* Categories Grid - Flexible responsive layout */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {categories.map((category) => {
            const Icon = categoryIcons[category.name] || Package;
            const productCount = category._count?.products || 0;
            
            return (
              <motion.div key={category.id} variants={itemVariants} className="w-full">
                <Link 
                  to={`/products?category=${category.id}`}
                  className="group block h-full"
                >
                  <motion.div 
                    className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 h-full flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px] md:min-h-[180px]"
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-center mb-3 sm:mb-4 md:mb-5">
                      <motion.div 
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-50 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-gray-100 transition-colors duration-300"
                        whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-700 group-hover:scale-110 transition-transform duration-300" />
                      </motion.div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 sm:mb-1.5 text-xs sm:text-sm md:text-base group-hover:text-gray-700 transition-colors line-clamp-2 wrap-break-word px-1">
                      {category.name}
                    </h3>
                    {productCount > 0 && (
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-auto pt-1 sm:pt-2">{productCount} {productCount === 1 ? 'รายการ' : 'รายการ'}</p>
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All Link */}
        <motion.div 
          className="text-center mt-8 sm:mt-10 md:mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium text-xs sm:text-sm transition-colors group px-4"
          >
            <span>ดูสินค้าทั้งหมด</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
