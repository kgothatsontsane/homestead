import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PuffLoader } from 'react-spinners';
import { useTheme } from '../hooks/useTheme';

const FullscreenLoader = ({ isLoading, progress = 0 }) => {
  // Move hook outside of conditional rendering
  const { secondary } = useTheme();

  // Ensure consistent hook calls by moving AnimatePresence outside
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
        >
          <div className="text-center">
            <motion.h2
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-[900] text-[32px] mb-8"
            >
              Home<span className="font-[600]">stead</span>
            </motion.h2>
            
            <div className="flex flex-col items-center gap-6">
              <PuffLoader color={secondary} size={60} />
              
              <div className="w-48 bg-secondary/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-secondary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default React.memo(FullscreenLoader);
