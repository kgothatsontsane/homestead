import { PROPERTIES } from '../constant/data';

// Simulate API fetch with mock data
export const fetchProperties = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('[propertyService] Fetching properties');
  return PROPERTIES;
};

export const getPropertyById = async (id) => {
  const property = PROPERTIES.find(p => p.id === id);
  if (!property) {
    throw new Error('Property not found');
  }
  return property;
};
