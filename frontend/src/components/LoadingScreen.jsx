import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '../contexts/LoadingContext';

const LoadingScreen = () => {
  const { loading, progress, message } = useLoading();
  const [showTip, setShowTip] = useState(false);
  const tips = [
    'Preparing your experience...',
    'Loading property details...',
    'Almost there...',
    'Optimizing images...'
  ];

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setShowTip(prev => !prev);
    }, 3000);

    return () => clearInterval(tipTimer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
        >
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="mt-4 text-gray-600 font-medium">{message || 'Loading...'}</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={showTip}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-2 text-sm text-gray-400"
            >
              {tips[Math.floor(Math.random() * tips.length)]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
