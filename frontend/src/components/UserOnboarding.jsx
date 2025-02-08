import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ROLES } from '../utils/userRoles';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaBuilding, FaUserTie, FaSearch, FaPlus, FaChartLine, FaKey } from 'react-icons/fa';
import { syncUserData, verifyUserRoles } from '../services/userService';
import { getRandomBackground } from '../utils/backgroundImages';

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
    className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
    style={{ 
      backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7)), url(${bgImage})` 
    }}
  >
    <motion.div 
      className="max-w-2xl w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 relative"
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

  const handlePrimaryRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      primaryRole: role,
      roles: [role]
    }));
    // Only show step 2 for Agent or Owner
    setStep(role === ROLES.BUYER ? 3 : 2);
  };

  const handleAdditionalRole = (role) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
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
            onClick={() => handlePrimaryRoleSelect(role)}
            className="w-full p-6 text-left border-2 border-white/20 rounded-xl 
              hover:bg-white/10 transition-all group"
            whileHover={{ scale: 1.01 }}
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
    const availableCombinations = ROLE_COMBINATIONS[formData.primaryRole]?.allowedCombinations || [];
    
    return (
      <>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Additional Capabilities</h2>
          <p className="text-xl text-white/80 mt-2">
            Select additional roles you'd like to have (optional)
          </p>
        </div>
        <div className="space-y-4">
          {availableCombinations.map(role => (
            <motion.button
              key={role}
              onClick={() => handleAdditionalRole(role)}
              className="w-full p-4 text-left border-2 border-white/20 rounded-xl 
                hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{getRoleDisplay(role)}</div>
                  <p className="text-sm text-gray-300">
                    {role === ROLES.BUYER ? "Browse and purchase properties" : 
                     role === ROLES.INVESTOR ? "Invest in properties" :
                     role === ROLES.AGENT ? "List and sell properties" :
                     "Manage your properties"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.roles.includes(role)}
                  onChange={() => handleAdditionalRole(role)}
                  className="h-5 w-5 rounded border-white/20 bg-white/10"
                />
              </div>
            </motion.button>
          ))}
        </div>
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setStep(1)}
            className="px-6 py-2 text-white/80 hover:text-white"
          >
            ← Back
          </button>
          <button
            onClick={() => setStep(3)}
            className="px-6 py-2 bg-primary text-white rounded-lg"
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
      console.log('🚀 Starting user onboarding completion...');
      
      const syncResult = await syncUserData({
        user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        roles: formData.roles
      });
      
      // Verify roles were synced correctly
      const verification = await verifyUserRoles(user.id);
      
      if (!verification.rolesMatch) {
        console.error('⚠️ Role mismatch detected:', verification);
        toast.warning('Role synchronization issue detected');
      }

      console.log('✅ Onboarding complete:', { syncResult, verification });
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Onboarding failed:', error);
      setIsSubmitting(false);
      toast.error('Failed to complete setup');
    }
  };

  return (
    <StepContainer bgImage={bgImage}>
      <ProgressIndicator currentStep={step} />
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderPersonalDetails()}
    </StepContainer>
  );
};

export default UserOnboarding;
