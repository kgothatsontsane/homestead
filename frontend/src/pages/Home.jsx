/**
 * @fileoverview Home page component with optimized image loading and performance monitoring
 * Implements dynamic imports and lazy loading for better performance
 */
import React, { useEffect, useRef } from 'react'
import Hero from '../components/Hero'
import About from '../components/About'
import Properties from '../components/Properties'
import { useLoading } from '../contexts/LoadingContext';
import { globalPreloader } from '../utils/preloader';

const featuredImg = new URL('../assets/featured.png', import.meta.url).href

/**
 * Home Page Component
 * @component
 * @description Main landing page with hero section, about section, and property listings
 */
const Home = () => {
  const { startLoading, updateProgress, stopLoading } = useLoading();
  const pageLoadTime = useRef(performance.now());

  // Monitor component performance
  useEffect(() => {
    const loadResources = async () => {
      startLoading('Preparing your homestead experience...');
      
      try {
        // Start with initial loading state
        updateProgress(10, 'Loading essential resources...');
        
        // Preload critical images
        await Promise.all([
          globalPreloader.preloadImage(featuredImg),
          // Add other critical images here
        ]);
        
        updateProgress(40, 'Loading components...');
        
        // Preload components
        await Promise.all([
          globalPreloader.preloadComponent(() => import('../components/Hero')),
          globalPreloader.preloadComponent(() => import('../components/About')),
          globalPreloader.preloadComponent(() => import('../components/Properties'))
        ]);

        updateProgress(80, 'Finalizing...');

        // Artificial delay to show loading screen (remove in production)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        stopLoading();
      } catch (error) {
        console.error('Error preloading resources:', error);
        stopLoading();
      }
    };

    loadResources();
  }, [startLoading, updateProgress, stopLoading]);

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