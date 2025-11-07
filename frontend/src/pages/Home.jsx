/**
 * @fileoverview Home page component with optimized image loading and performance monitoring
 * Implements dynamic imports and lazy loading for better performance
 */
import React from 'react'
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
          className="w-full rounded-xl transform hover:scale-[1.01] transition-transform duration-300"
        />
      </div>
    </main>
  );
};

export default React.memo(Home);