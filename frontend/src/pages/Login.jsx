import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authLogger } from '../config/authConfig';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useClerk } from '@clerk/clerk-react';

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle, loginWithFacebook, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { openSignIn } = useClerk();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLoginMode) {
        const response = await login(formData.email, formData.password);
        authLogger.info('Login successful', { userId: response.user.id });
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const response = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        authLogger.info('Registration successful', { userId: response.user.id });
      }
      navigate(location.state?.from?.pathname || '/');
    } catch (err) {
      authLogger.error(`${isLoginMode ? 'Login' : 'Registration'} failed`, { error: err.message });
      setError(err.message || `${isLoginMode ? 'Login' : 'Registration'} failed`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = useCallback((provider) => {
    openSignIn({
      afterSignInUrl: location.state?.from?.pathname || '/',
      appearance: {
        elements: {
          rootBox: "w-full",
          card: "rounded-xl shadow-xl",
        }
      }
    });
  }, [location, openSignIn]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-primary/30 pt-32 pb-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Logo & Welcome Text */}
        <div className="px-8 pt-8 pb-6 text-center">
          <h2 className="font-[900] text-[28px] mb-2">
            Home<span className="font-[600]">stead</span>
          </h2>
          <p className="text-gray-600">
            {isLoginMode ? 'Welcome back to your real estate journey' : 'Create your account'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-8 mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Social Login Buttons */}
        {isLoginMode && (
          <div className="px-8 space-y-3">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FcGoogle className="text-2xl" />
              <span className="text-gray-700">Continue with Google</span>
            </button>
            <button
              onClick={() => handleSocialLogin('facebook')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#1864D6] transition-colors"
            >
              <FaFacebook className="text-2xl" />
              <span>Continue with Facebook</span>
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
          </div>
        )}

        {/* Login/Register Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                required={!isLoginMode}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              {isLoginMode && (
                <Link to="/forgot-password" className="text-sm text-secondary hover:text-secondary/80">
                  Forgot password?
                </Link>
              )}
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
              required
            />
          </div>

          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                required={!isLoginMode}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full btn-secondary rounded-lg py-3 transition-all
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'}`}
          >
            {isLoading ? 'Please wait...' : (isLoginMode ? 'Sign in' : 'Create Account')}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-secondary hover:text-secondary/80 font-medium"
            >
              {isLoginMode ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
