import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// Fix: Update imports to match exports
import RoleSelector from '../../components/RoleSelector';
import ProfileSetup from './steps/ProfileSetup.jsx';

const OnboardingFlow = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    role: '',
    additionalRoles: [],
    profile: {}
  });
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Starting onboarding flow:', { userId: user?.id });
  }, [user]);

  const handleRoleSelection = async (role) => {
    console.log('Role selected:', role);
    try {
      await user?.update({
        publicMetadata: {
          ...user.publicMetadata,
          role
        }
      });
      setUserData(prev => ({ ...prev, role }));
      setStep(2);
    } catch (error) {
      console.error('Role selection error:', error);
      toast.error('Failed to set role');
    }
  };

  const handleProfileComplete = async (profileData) => {
    console.log('Profile data:', profileData);
    try {
      await user?.update({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        publicMetadata: {
          ...user.publicMetadata,
          ...profileData
        }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Profile completion error:', error);
      toast.error('Failed to complete profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {step === 1 && (
        <RoleSelector 
          selectedRole={userData.role}
          onRoleSelect={handleRoleSelection}
        />
      )}
      {step === 2 && (
        <ProfileSetup
          onComplete={handleProfileComplete}
          initialData={userData}
        />
      )}
    </div>
  );
};

// Fix: Add proper export
export default OnboardingFlow;
