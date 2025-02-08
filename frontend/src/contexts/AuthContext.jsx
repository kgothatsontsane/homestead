import { createContext, useContext, useCallback } from 'react';
import { useClerk, useUser, useSignIn, useSignUp } from '@clerk/clerk-react';
import { authLogger } from '../config/authConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { signOut } = useClerk();
  const { user, isSignedIn, isLoaded } = useUser();
  const { signIn, setActive: setSignInActive } = useSignIn();
  const { signUp, setActive: setSignUpActive } = useSignUp();

  const login = useCallback(async (email, password) => {
    try {
      authLogger.info('Login attempt', { email });
      const result = await signIn.create({
        identifier: email,
        password,
      });
      
      await setSignInActive({ session: result.createdSessionId });
      authLogger.info('Login successful');
      return result;
    } catch (error) {
      authLogger.error('Login failed', { error });
      throw error;
    }
  }, [signIn, setSignInActive]);

  const register = useCallback(async ({ email, password, name, role }) => {
    try {
      authLogger.info('Registration attempt', { email, role });
      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
        publicMetadata: {
          role: role
        }
      });

      await setSignUpActive({ session: result.createdSessionId });
      authLogger.info('Registration successful');
      return result;
    } catch (error) {
      authLogger.error('Registration failed', { error });
      throw error;
    }
  }, [signUp, setSignUpActive]);

  const logout = useCallback(async () => {
    try {
      authLogger.info('Logout initiated');
      await signOut();
      authLogger.info('Logout successful');
    } catch (error) {
      authLogger.error('Logout failed', { error });
      throw error;
    }
  }, [signOut]);

  const value = {
    user: isSignedIn ? user : null,
    isAuthenticated: isSignedIn,
    login,
    register,
    logout,
    loading: !isLoaded
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
