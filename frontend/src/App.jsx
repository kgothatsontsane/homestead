/**
 * @fileoverview Main application component with routing and global configurations
 * Implements custom query client settings and lazy loading for optimal performance
 */
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Home from './pages/Home';
import Listings from './pages/Listings';
import AddProperty from './pages/AddProperty';
import Bookings from './pages/Bookings';
import Favourites from './pages/Favourites';
import Contact from './pages/Contact';
import Layout from './components/Layout';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Property from './pages/Property';
import ScrollToTop from './components/ScrollToTop';

// Custom query client configuration with unique settings
const createCustomQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (error?.response?.status === 404) return false;
          return failureCount < 2;
        }
      }
    }
  });
};

export default function App() {
  const queryClient = createCustomQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="animate-pulse text-xl">Loading Homestead...</div>
          </div>
        }>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/listings">
                <Route index element={<Listings />} />
                <Route path=":propertyId" element={<Property/>} />
              </Route>
              <Route path="/add-property" element={<AddProperty />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/contact" element={<Contact />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
