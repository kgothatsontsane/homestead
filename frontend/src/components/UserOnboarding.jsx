import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ROLES, ROLE_COMBINATIONS, getRoleDisplay } from '../utils/userRoles';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaBuilding, FaUserTie, FaSearch, FaPlus, FaChartLine, FaKey, FaQuestionCircle } from 'react-icons/fa';
import { syncUserData, verifyUserRoles, updateUserProfile, syncUserRoles } from '../services/userService';
import { getRandomBackground } from '../utils/backgroundImages';
import { getUserRole } from '../utils/roleUtils';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'react-toastify';

const ProgressIndicator = ({ currentStep }) => (
  <div className="absolute top-8 right-8 flex items-center gap-2">
    {[1, 2, 3].map((step) => (
      <div
        key={step}
        className={`h-2.5 rounded-full transition-all duration-300 ${
          step === currentStep ? 'w-8 bg-primary' : 
          step < currentStep ? 'w-8 bg-primary/50' : 
          'w-6 bg-gray-200'
        }`}
      />
    ))}
  </div>
);

const INITIAL_ROLES = [
  {
    id: ROLES.BUYER,
    title: "Home Buyer",
    description: "I want to browse and purchase properties",
    icon: FaHome,
    allowsCombined: false
  },
  {
    id: ROLES.AGENT, // This will handle both Agent and Owner
    title: "Property Agent/Owner",
    description: "I want to list and sell properties",
    icon: FaBuilding,
    allowsCombined: true
  }
];

const StepContainer = ({ children, bgImage }) => (
  <div 
    className="min-h-screen py-16 px-4 flex items-center justify-center bg-cover bg-center"
    style={{ 
      backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7)), url(${bgImage})`,
      minHeight: 'calc(100vh - 0px)' // Remove any potential layout padding
    }}
  >
    <motion.div 
      className="max-w-2xl w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 relative my-auto"
    >
      {children}
    </motion.div>
  </div>
);
 
const STEP_CONFIG = {
  1: {
    title: "Choose Your Primary Role",
    subtitle: "How do you primarily want to use Homestead?",
    options: [
      {
        role: ROLES.UNSET,
        title: "I'm not sure yet",
        description: "Browse all features before deciding",
        icon: FaQuestionCircle
      },
      {
        role: ROLES.BUYER,
        title: "Home Buyer",
        description: "I want to browse and purchase properties",
        icon: FaSearch
      },
      {
        role: ROLES.AGENT,
        title: "Real Estate Agent",
        description: "I want to list and sell properties professionally",
        icon: FaUserTie
      },
      {
        role: ROLES.OWNER,
        title: "Property Owner",
        description: "I want to list and manage my properties",
        icon: FaBuilding
      },
      {
        role: ROLES.INVESTOR,
        title: "Property Investor",
        description: "I want to invest in multiple properties",
        icon: FaChartLine
      },
      {
        role: ROLES.TENANT,
        title: "Tenant",
        description: "I want to rent properties",
        icon: FaKey
      }
    ]
  },
  2: {
    title: "Additional Roles",
    subtitle: "Select additional capabilities you'd like to have"
  },
  3: {
    title: "Complete Your Profile",
    subtitle: "Just a few more details to get started"
  }
};

// Add role icons mapping for step 2
const ROLE_ICONS = {
  [ROLES.UNSET]: FaQuestionCircle,
  [ROLES.BUYER]: FaSearch,
  [ROLES.AGENT]: FaUserTie,
  [ROLES.OWNER]: FaBuilding,
  [ROLES.INVESTOR]: FaChartLine,
  [ROLES.TENANT]: FaKey
};

const ErrorFallback = ({ error }) => (
  <div className="p-6 bg-red-50 m-4 rounded">
    <h2 className="text-red-800 text-xl font-bold mb-2">Something went wrong:</h2>
    <pre className="text-sm text-red-600">{error.message}</pre>
    <button 
      onClick={() => window.location.reload()}
      className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Try again
    </button>
  </div>
);

const UserOnboarding = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const bgImage = getRandomBackground();
  
  const [formData, setFormData] = useState({
    primaryRole: null,
    additionalRoles: [],
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    phoneNumber: ''
  });
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const currentRole = getUserRole(user);
    console.log('Onboarding check:', { 
      userId: user?.id, 
      currentRole,
      hasRole: Boolean(currentRole)
    });

    // Initialize role if not set - removed automatic 'buyer' assignment
    if (!currentRole) {
      user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          roles: [ROLES.UNSET],
          primaryRole: ROLES.UNSET
        }
      });
    }
  }, [user]);

  useEffect(() => {
    // Force role check on mount
    if (user?.id) {
      const roles = user.publicMetadata?.roles || [];
      const hasValidRole = roles.length > 0 && !roles.includes(ROLES.UNSET);
      
      if (!hasValidRole) {
        setStep(1); // Force to role selection step
      }
    }
  }, [user]);

  const handleRoleSelection = async (role) => {
    console.log('Attempting role selection:', role);
    try {
      if (!user?.id) {
        toast.error('User session not found');
        return;
      }

      setIsSubmitting(true);
      
      // Create roles array
      const initialRoles = [role];
      
      try {
        // Update Clerk metadata - using unsafeMetadata instead of publicMetadata
        await user.update({
          unsafeMetadata: {  // Changed from publicMetadata to unsafeMetadata
            ...user.unsafeMetadata,
            roles: initialRoles,
            primaryRole: role,
            lastUpdated: new Date().toISOString()
          }
        });

        // Sync with database
        const syncResult = await syncUserRoles(user.id, initialRoles, role);
        console.log('Sync result:', syncResult);

        // Update local state
        setFormData(prev => ({
          ...prev,
          primaryRole: role,
          roles: initialRoles // Important: Set the roles array
        }));

        toast.success('Role updated successfully');
        setStep(2); // Move to next step
      } catch (error) {
        throw new Error(`Role sync failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Role selection error:', error);
      toast.error(error.message || 'Failed to set role');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdditionalRole = async (role) => {
    try {
      const newRoles = formData.roles.includes(role)
        ? formData.roles.filter(r => r !== role)
        : [...formData.roles, role];

      await syncUserRoles(user.id, newRoles, formData.primaryRole);
      setFormData(prev => ({ ...prev, roles: newRoles }));
    } catch (error) {
      console.error('Additional role update error:', error);  
      toast.error('Failed to update roles');
    }
  };

  const renderStep1 = () => (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">{STEP_CONFIG[1].title}</h2>
        <p className="text-xl text-white/80 mt-2">{STEP_CONFIG[1].subtitle}</p>
      </div>
      <div className="space-y-4">
        {STEP_CONFIG[1].options.map(({ role, title, description, icon: Icon }) => (
          <motion.button
            key={role}
            onClick={() => {
              console.log('Button clicked for role:', role); // Debug log
              handleRoleSelection(role);
            }}
            disabled={isSubmitting}
            className={`w-full p-6 text-left border-2 border-white/20 rounded-xl 
              hover:bg-white/10 transition-all group ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/20 rounded-full">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-medium text-lg text-white">{title}</div>
                <p className="text-gray-300 mt-1">{description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </>
  );

  const renderStep2 = () => {
    const availableRoles = Object.values(ROLES).filter(role => 
      role !== formData.primaryRole && role !== ROLES.ADMIN && role !== ROLES.UNSET
    );
    
    return (
      <>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Additional Capabilities</h2>
          <p className="text-xl text-white/80 mt-2">
            Select additional roles you'd like to have (optional)
          </p>
        </div>
        <div className="space-y-4">
          {availableRoles.map(role => {
            const roleConfig = STEP_CONFIG[1].options.find(opt => opt.role === role);
            const Icon = ROLE_ICONS[role] || FaBuilding; // Fallback icon

            return (
              <motion.button
                key={role}
                onClick={() => handleAdditionalRole(role)}
                className="w-full p-4 text-left border-2 border-white/20 rounded-xl 
                  hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/20 rounded-full">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{getRoleDisplay(role)}</div>
                      <p className="text-sm text-gray-300">{roleConfig?.description || 'Additional role capabilities'}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.roles.includes(role)}
                    onChange={() => handleAdditionalRole(role)}
                    className="h-5 w-5 rounded border-white/20 bg-white/10 text-primary focus:ring-primary"
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setStep(1)}
            className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
          >
            ← Back
          </button>
          <button
            onClick={() => setStep(3)}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Continue →
          </button>
        </div>
      </>
    );
  };

  const renderPersonalDetails = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">Complete Your Profile</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4">        {['firstName', 'lastName'].map(field => (          <div key={field}>            <input              type="text"              required              value={formData[field]}              onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}              placeholder={field === 'firstName' ? 'First Name' : 'Last Name'}              className="w-full p-4 bg-white/10 border border-white/20 rounded-lg                 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary"            />          </div>        ))}      </div>      <input        type="text"        required        value={formData.username}        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}        placeholder="Username"        className="w-full p-4 bg-white/10 border border-white/20 rounded-lg           text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary"      />      <input        type="tel"
        required
        value={formData.phoneNumber}
        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
        placeholder="Phone Number"
        className="w-full p-4 bg-white/10 border border-white/20 rounded-lg 
          text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary"
      />

      <div className="flex gap-4 mt-8">
        <button
          type="button"
          onClick={() => setStep(prev => prev - 1)}
          className="flex-1 p-4 text-white border border-white/20 rounded-lg hover:bg-white/10"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 p-4 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Complete Setup'}
        </button>
      </div>
    </form>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update Clerk profile first
      await user.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username
      });

      // Then update our database
      await updateUserProfile({
        user,
        ...formData,
        onboardingComplete: true
      });

      toast.success('Profile completed successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Failed to complete setup');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add debug logging to step state changes
  useEffect(() => {
    console.log('Current step:', step);
    console.log('Current formData:', formData);
  }, [step, formData]);

  return (
    <div className="min-h-screen w-full bg-black">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <StepContainer bgImage={bgImage}>
          <ProgressIndicator currentStep={step} />
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderPersonalDetails()}
        </StepContainer>
      </ErrorBoundary>
    </div>
  );
};

export default UserOnboarding;
