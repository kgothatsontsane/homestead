import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { getProperty } from '../utils/api';

const Property = () => {

  const { pathname } = useLocation();
  const id = pathname.split('/').slice(-1)[0]
  console.log(id)
  
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["property", id],
    queryFn: () => getProperty(id),
  });
  console.log(data)
  return (
    <div>Property</div>
  )
}

export default Property