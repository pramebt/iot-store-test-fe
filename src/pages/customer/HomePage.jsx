import { lazy, Suspense } from 'react';
import Hero from '../../components/customer/home/Hero';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Lazy load components for better initial load performance
const Categories = lazy(() => import('../../components/customer/home/Categories'));
const FeaturedProducts = lazy(() => import('../../components/customer/home/FeaturedProducts'));
const Stats = lazy(() => import('../../components/customer/home/Stats'));
const Features = lazy(() => import('../../components/customer/home/Features'));

// Simple loading fallback component
const SectionLoadingFallback = ({ height = 'py-20' }) => (
  <div className={`flex justify-center items-center ${height}`}>
    <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
  </div>
);

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero loads immediately as it's above the fold */}
      <Hero />
      
      {/* Lazy load sections below the fold */}
      <Suspense fallback={<SectionLoadingFallback height="py-24" />}>
        <Categories />
      </Suspense>
      
      <Suspense fallback={<SectionLoadingFallback height="py-24" />}>
        <FeaturedProducts />
      </Suspense>
      
      <Suspense fallback={<SectionLoadingFallback height="py-24" />}>
        <Stats />
      </Suspense>
      
      <Suspense fallback={<SectionLoadingFallback height="py-24" />}>
        <Features />
      </Suspense>
    </motion.div>
  );
}
