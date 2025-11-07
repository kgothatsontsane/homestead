import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollUpButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 200); // Lower threshold
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`${
        isVisible ? 'scale-100' : 'scale-0'
      } fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:bg-blue-600 focus:outline-none z-[100] transform`}
      aria-label="Scroll to top"
    >
      <FaArrowUp className="text-2xl" />
    </button>
  );
};

export default ScrollUpButton;
