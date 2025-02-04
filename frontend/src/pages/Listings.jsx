import React, { useMemo, useEffect, useCallback } from 'react'
import Searchbar from '../components/Searchbar'
import { PROPERTIES } from '../constant/data'
import Item from '../components/Item'
import useProperties from '../hooks/useProperties'

const Listings = () => {
  const { data, isError, isLoading, error, refetch } = useProperties()
  
  // Move all hooks to the top, before any conditions
  const handleRefetch = useCallback(async () => {
    console.log('[Listings] Refetching properties...');
    await refetch();
  }, [refetch]);

  const logState = useMemo(() => ({
    hasData: Boolean(data),
    dataLength: data?.length,
    isError,
    isLoading,
    errorMessage: error instanceof Error ? error.message : 'Unknown error',
    renderTime: `${performance.now()}ms`
  }), [data, isError, isLoading, error]);

  useEffect(() => {
    console.log('[Listings] Component state:', logState);
  }, [logState]);

  useEffect(() => {
    if (isError) {
      console.error('[Listings] Error fetching properties:', error);
    }
  }, [isError, error]);

  const propertyList = useMemo(() => (
    PROPERTIES.map((property) => (
      <Item key={property.title} property={property} />
    ))
  ), []);

  // After all hooks, we can have conditional returns
  if (isError) {
    return (
      <main>
        <div className='max-padd-container my-[99px]'>
          <div className='max-padd-container py-10 xl:py-22 bg-primary rounded-xl'>
            <h1 className='text-2xl text-center'>An error occurred while fetching properties</h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='max-padd-container my-[99px]'>
      <div className='max-padd-container py-10 xl:py-22 bg-primary rounded-xl'>
        <div>
          <div className='flex justify-between items-center'>
            <Searchbar />
            <button
              onClick={handleRefetch}
              disabled={isLoading}
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50'
            >
              {isLoading ? 'Refetching...' : 'Refetch'}
            </button>
          </div>
          <div className='grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-12'>
            {propertyList}
          </div>
        </div>
      </div>
    </main>
  );
}

export default React.memo(Listings)