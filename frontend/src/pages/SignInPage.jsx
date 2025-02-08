import { SignIn } from "@clerk/clerk-react";
import { useLocation } from 'react-router-dom';
import AuthPageLayout from '../components/AuthPageLayout';
import { clerkAppearance } from '../config/themeConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import { useState } from 'react';

const SignInPage = () => {
  const location = useLocation();
  const isCallback = location.pathname.includes('sso-callback');
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect_url') || '/dashboard';
  const [loadingProgress, setLoadingProgress] = useState(0);

  return (
    <AuthPageLayout subtitle="Find your perfect home">
      <SignIn 
        routing="path" 
        path="/sign-in"
        signUpUrl="/sign-up"
        redirectUrl={redirectUrl}
        afterSignInUrl={redirectUrl}
        handleSSOCallback={true}
        appearance={{
          ...clerkAppearance,
          layout: {
            shimmer: false,
            loadingPlaceholder: () => (
              <LoadingSpinner showProgress={true} progress={loadingProgress} />
            )
          }
        }}
        afterLoaded={() => setLoadingProgress(100)}
      />
    </AuthPageLayout>
  );
};

export default SignInPage;
