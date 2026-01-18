import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/it-hero.webp')`,
          transform: `translateY(${scrollY * 0.5}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Gradient Overlay - Darker at top, lighter at bottom */}
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/40"></div>
        
        {/* Additional gradient for better text readability */}
        <div className="absolute inset-0 bg-linear-to-b from-gray-900/30 via-transparent to-gray-900/20"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(255,255,255) 1px, transparent 0)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full py-20">
        <div className="max-w-5xl mx-auto text-center">
          

          {/* Main Heading with text shadow */}
          <h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.1] drop-shadow-2xl"
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            Innovation Meets
            <br />
            <span className="bg-linear-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Excellence
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-12 leading-relaxed font-light max-w-3xl mx-auto drop-shadow-lg">
            Discover cutting-edge IoT products designed for the modern world. 
            <br className="hidden sm:block" />
            Quality, reliability, and innovation in every purchase.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/products">
              <button className="group bg-white text-gray-900 text-base px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105 inline-flex items-center gap-2 font-semibold">
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/about">
              <button className="text-white text-base px-8 py-4 rounded-full hover:bg-white/10 backdrop-blur-sm transition-all duration-300 border-2 border-white/30 hover:border-white/50 font-semibold hover:scale-105">
                Learn More
              </button>
            </Link>
          </div>

          
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}
