/**
 * @fileoverview Home page component with optimized image loading and performance monitoring
 * Implements dynamic imports and lazy loading for better performance
 */
import React, { useEffect, useRef } from 'react'
import Hero from '../components/Hero'
import About from '../components/About'
import Properties from '../components/Properties'

const featuredImg = new URL('../assets/featured.png', import.meta.url).href

/**
 * Home Page Component
 * @component
 * @description Main landing page with hero section, about section, and property listings
 */
const Home = () => {
  const pageLoadTime = useRef(performance.now());

  // Monitor component performance
  useEffect(() => {
    const loadTime = performance.now() - pageLoadTime.current;
    console.log(`[Home] Page load time: ${loadTime.toFixed(2)}ms`);

    // Preload featured image for better performance
    const img = new Image();
    img.src = featuredImg;

    return () => {
      console.log(`[Home] Total page lifetime: ${(performance.now() - pageLoadTime.current).toFixed(2)}ms`);
    };
  }, []);

  return (
    <main className="overflow-x-hidden">
      <Hero />
      <About />
      <Properties />
      <div className="max-padd-container py-16">
        <img 
          src={featuredImg} 
          alt="Featured properties showcase" 
          loading="lazy"
          className="w-full rounded-xl shadow-lg transform hover:scale-[1.01] transition-transform duration-300"
        />
      </div>
    </main>
  );
};

export default React.memo(Home);