import Hero from '../../components/customer/home/Hero';
import Categories from '../../components/customer/home/Categories';
import FeaturedProducts from '../../components/customer/home/FeaturedProducts';
import Stats from '../../components/customer/home/Stats';
import Features from '../../components/customer/home/Features';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Stats />
      <Features />
    </div>
  );
}
