import Hero from '../../components/customer/home/Hero';
import Categories from '../../components/customer/home/Categories';
import FeaturedProducts from '../../components/customer/home/FeaturedProducts';
import Stats from '../../components/customer/home/Stats';
import Features from '../../components/customer/home/Features';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Stats />
      <Features />
    </motion.div>
  );
}
