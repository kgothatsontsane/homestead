import React, { useMemo, useEffect, useCallback } from 'react'
import Searchbar from '../components/Searchbar'
import Item from '../components/Item'
import useProperties from '../hooks/useProperties'
import { PuffLoader } from 'react-spinners'

const Listings = () => {
  const { data, isError, isLoading, error, refetch } = useProperties()
  
  // Move all hooks to the top, before any conditions
  const handleRefetch = useCallback(async () => {
    console.log('[Listings] Refetching properties...');
    await refetch();
  }, [refetch]);

  const logState = useMemo(() => {
    let errorMessage = '';
    if (isError) {
      errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred while fetching properties';
    }
    return {
      hasData: Boolean(data),
      dataLength: data?.length,
      isError,
      isLoading,
      errorMessage,
      renderTime: `${performance.now()}ms`
    };
  }, [data, isError, isLoading, error]);

  useEffect(() => {
    console.log('[Listings] Component state:', logState);
  }, [logState]);

  useEffect(() => {
    if (isError) {
      console.error('[Listings] Error fetching properties:', error);
    }
  }, [isError, error]);

  useEffect(() => {
    if (isLoading) {
      console.log('[Listings] Loading properties...');
    }
  }, [isLoading]);

  const propertyList = useMemo(() => {
    if (!data) return [];
    return data
      .filter(property => property !== null)
      .map((property) => (
        <Item 
          key={property._id || property.title} 
          property={{
            ...property,
            area: property.area || 0
          }} 
        />
      ));
  }, [data]);

  // Show loading state if data is not yet available or loading
  if (isLoading || !data) {
    return (
      <main>
        <div className='flex justify-center items-center h-screen'>
          <PuffLoader size={60} color={"#123abc"} loading={true} aria-label="puff-loading" />
        </div>
      </main>
    );
  }

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