import { Link } from 'react-router-dom';
import Button from '../../common/Button';

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-gray-900 mb-6 leading-tight">
            Welcome to IoT Store
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed font-light max-w-3xl mx-auto">
            Your trusted source for quality IoT products and electronics. 
            Discover innovative solutions for your smart home and business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/products">
              <button className="bg-gray-900 text-white text-base px-8 py-3 rounded-full hover:bg-gray-800 transition-all shadow-sm hover:shadow-md">
                Shop Now
              </button>
            </Link>
            <Link to="/about">
              <button className="text-gray-900 text-base px-8 py-3 rounded-full hover:bg-gray-100 transition-all">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
