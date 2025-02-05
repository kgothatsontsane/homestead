import React, { useEffect, useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { getAllProperties } from '../utils/api'

// Native debounce function
const createDebounce = (callback, delay) => {
  let timeoutId;
  
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
};

const useProperties = () => {
  const queryResult = useQuery({
    queryKey: ['allProperties'],
    queryFn: getAllProperties,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  })

  // Native debounced logging function
  const debouncedLog = useCallback(
    createDebounce((type, data) => {
      console.log(`[useProperties] ${type}:`, data);
    }, 300),
    []
  );

  // Memoized state extraction
  const currentState = useMemo(() => {
    const { data, isError, isLoading, error, refetch } = queryResult;
    return {
      data,
      isError,
      isLoading,
      error,
      refetch,
      dataExists: Boolean(data),
      dataCount: data?.length
    };
  }, [queryResult.data, queryResult.error, queryResult.isError, queryResult.isLoading, queryResult.refetch]);

  useEffect(() => {
    // Performance measurement
    const start = performance.now();
    
    if (currentState.isError && currentState.error) {
      if (currentState.error instanceof AxiosError) {
        debouncedLog('Axios error', {
          message: currentState.error.message,
          response: currentState.error.response?.data,
          timestamp: new Date().toISOString()
        });
      }
    }

    if (currentState.data) {
      debouncedLog('Data updated', {
        count: currentState.dataCount,
        timestamp: new Date().toISOString()
      });
    }

    debouncedLog('Performance', {
      duration: performance.now() - start,
      timestamp: new Date().toISOString()
    });
  }, [currentState, debouncedLog]);

  return {
    ...queryResult,
    refetch: currentState.refetch
  };
}

export default useProperties