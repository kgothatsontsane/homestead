import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollUpButton from './ScrollUpButton';

const Layout = () => {
  const location = useLocation();


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer className="z-10 relative bg-white" />
      <ScrollUpButton />
    </div>
  );
};

export default Layout;