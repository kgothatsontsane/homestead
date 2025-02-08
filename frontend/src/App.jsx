/**
 * @fileoverview Main application component with routing and global configurations
 * Implements custom query client settings and lazy loading for optimal performance
 */
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import { ClerkProvider, SignedIn } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorBoundary } from 'react-error-boundary';
import { LoadingProvider } from './contexts/LoadingContext';
import LoadingScreen from './components/LoadingScreen';

// Page imports
import Home from './pages/Home';
import Listings from './pages/Listings';
import Contact from './pages/Contact';
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardRouter from './components/DashboardRouter';
import UserOnboarding from './components/UserOnboarding';

// Component imports
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';

// Utility imports
import { validateEnv } from './utils/envCheck';
import { testApiConnection } from './services/userService';
import { preloadBackgrounds } from './utils/backgroundImages';
import { clerkAppearance } from './config/themeConfig';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Simplify clerk options to prevent duplicate initialization
const clerkOptions = {
  publishableKey: clerkPubKey,
  appearance: clerkAppearance,
  routing: {
    // New redirect props
    fallbackRedirectUrl: '/dashboard',
    forceRedirectUrl: '/onboarding',
    // Specific path redirects
    paths: {
      signIn: '/sign-in',
      signUp: '/sign-up'
    }
  }
};

// Custom query client configuration
const createCustomQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (error?.response?.status === 404) return false;
          return failureCount < 2;
        }
      }
    }
  });
};

const ErrorFallback = ({ error }) => (
  <div className="p-6 bg-blue-50 m-4 rounded">
    <h2 className="text-blue-800 text-xl font-bold mb-2">Something went wrong:</h2>
    <pre className="text-sm text-blue-600">{error.message}</pre>
  </div>
);

export default function App() {
  const queryClient = React.useMemo(() => createCustomQueryClient(), []);

  useEffect(() => {
    // Batch initialization tasks
    Promise.all([
      validateEnv(),
      testApiConnection(),
      preloadBackgrounds()
    ]).catch(console.error);

    // Clean up function - Remove the problematic Clerk cleanup
    return () => {
      // Clear query cache on unmount
      queryClient.clear();
    };
  }, [queryClient]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <LoadingProvider>
        <ClerkProvider {...clerkOptions}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <LoadingScreen />
              <ScrollToTop />
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="listings" element={<Listings />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="dashboard/*" 
                    element={
                      <SignedIn>
                        <DashboardRouter />
                      </SignedIn>
                    } 
                  />
                  <Route path="onboarding" 
                    element={
                      <SignedIn>
                        <UserOnboarding />
                      </SignedIn>
                    } 
                  />
                </Route>
                <Route path="sign-in/*" element={<SignInPage />} />
                <Route path="sign-up/*" element={<SignUpPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </QueryClientProvider>
        </ClerkProvider>
      </LoadingProvider>
    </ErrorBoundary>
  );
}
