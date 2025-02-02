import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Home from './pages/Home';
import Listings from './pages/Listings';
import AddProperty from './pages/AddProperty';
import Bookings from './pages/Bookings';
import Favourites from './pages/Favourites';
import Contact from './pages/Contact';import Layout from './components/Layout';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from 'react-toastify';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


export default function App() {

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/add-property" element={<AddProperty />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/contact" element={<Contact />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ToastContainer/>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
