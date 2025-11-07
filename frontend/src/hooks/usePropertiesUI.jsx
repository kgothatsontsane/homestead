import React from 'react';
import useProperties from './useProperties';

// UI/presentation logic hook
export const usePropertiesUI = () => {
  const { data: rawProperties, ...rest } = useProperties();
  
  const formattedProperties = React.useMemo(() => {
    if (!rawProperties) return [];
    
    return rawProperties.map(property => ({
      ...property,
      displayPrice: new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR'
      }).format(property.price),
      displayArea: `${property.area} m²`,
      facilities: property.facilities?.[0] || { bedrooms: 0, bathrooms: 0, parkings: 0 }
    }));
  }, [rawProperties]);

  return {
    properties: formattedProperties,
    ...rest
  };
};
