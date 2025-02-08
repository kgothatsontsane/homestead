export const validateEnv = () => {
  const requiredVars = [
    'VITE_CLERK_PUBLISHABLE_KEY',
    'VITE_API_BASE_URL'
  ];

  const missing = requiredVars.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }
  
  console.log('Environment variables validated successfully');
  return true;
};
