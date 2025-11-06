import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const SignInForm = ({ onClose, onSwitchMode }) => {
  const { signIn, setActive } = useSignIn();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate('/role-check');
      }
    } catch (error) {
      toast.error(error.message || 'Sign in failed');
      console.error('Sign in error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-700"
    >
      <h2 className="text-center text-3xl font-bold text-white mb-2">
        Welcome Back
      </h2>
      <p className="text-center text-sm text-gray-300 mb-8">
        Sign in to your Homestead account
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg 
                text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary 
                focus:border-transparent transition-colors"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              required
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg 
                text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary 
                focus:border-transparent transition-colors"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium
            hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-primary disabled:opacity-50 transition-all transform 
            hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={onSwitchMode}
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            Don't have an account? <span className="font-medium text-primary">Create one</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default SignInForm;