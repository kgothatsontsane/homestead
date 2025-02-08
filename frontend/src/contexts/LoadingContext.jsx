import React, { createContext, useContext, useState, useCallback } from 'react';
import { globalPreloader } from '../utils/preloader';

const LoadingContext = createContext({});

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const startLoading = useCallback((initialMessage = 'Loading...') => {
    setLoading(true);
    setProgress(0);
    setMessage(initialMessage);
    globalPreloader.reset();
  }, []);

  const updateProgress = useCallback((newProgress, newMessage) => {
    setProgress(newProgress);
    if (newMessage) setMessage(newMessage);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
    setProgress(100);
    globalPreloader.reset();
  }, []);

  return (
    <LoadingContext.Provider value={{
      loading,
      progress,
      message,
      startLoading,
      updateProgress,
      stopLoading
    }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
