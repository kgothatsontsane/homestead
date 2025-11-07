import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const SignUpForm = ({ onClose, onSwitchMode }) => {
  const { signUp, setActive } = useSignUp();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false); // Add verifying state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    username: '',
    roles: ['unset'],
    primaryRole: 'unset'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        unsafeMetadata: {
          roles: formData.roles,
          primaryRole: formData.primaryRole
        }
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate('/onboarding');
      } else {
        setVerifying(true); // Set verifying to true when verification starts
        const verification = await signUp.prepareEmailAddressVerification();
        const code = prompt('Please enter the verification code from your email:');
        
        if (code) {
          const completeSignUp = await signUp.attemptEmailAddressVerification({
            code,
          });
          
          if (completeSignUp.status === 'complete') {
            await setActive({ session: completeSignUp.createdSessionId });
            navigate('/onboarding');
          }
        }
        setVerifying(false); // Set verifying to false when verification ends
      }
    } catch (error) {
      setVerifying(false); // Set verifying to false on error
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
        Create Account
      </h2>
      <p className="text-center text-sm text-gray-300 mb-8">
        Join Homestead today
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                First Name
              </label>
              <input
                id="firstName"
                required
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg 
                  text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary 
                  focus:border-transparent transition-colors"
                placeholder="First name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                Last Name
              </label>
              <input
                id="lastName"
                required
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg 
                  text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary 
                  focus:border-transparent transition-colors"
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg 
                text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary 
                focus:border-transparent transition-colors"
              placeholder="Create a password"
              minLength={8}
            />
          </div>
        </div>

        <div id="clerk-captcha" className="mt-4" />

        <button
          type="submit"
          disabled={isSubmitting || verifying}
          className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium
            hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-primary disabled:opacity-50 transition-all transform 
            hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
        >
          {isSubmitting ? 'Creating Account...' : 
           verifying ? 'Verifying Email...' : 
           'Create Account'}
        </button>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={onSwitchMode}
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            Already have an account? <span className="font-medium text-primary">Sign in</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default SignUpForm;