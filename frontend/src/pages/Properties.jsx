
import React, { useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getAllProperties } from '../utils/api';
import { useProperties as usePropertiesData } from './useProperties';

// Native debounce function
const createDebounce = (callback, delay) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
};

const useProperties = () => {
  const { data, ...rest } = usePropertiesData();

  const formattedProperties = useMemo(() => {
    // UI-specific transformations
    return data?.map(p => ({
      ...p,
      displayPrice: new Intl.NumberFormat().format(p.price)
    }));
  }, [data]);

  return { data: formattedProperties, ...rest };
};

export default useProperties;