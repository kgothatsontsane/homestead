import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import RoleSelection from './steps/RoleSelection';
import ProfileSetup from './steps/ProfileSetup';
import { toast } from 'react-toastify';

const ProfileCompletion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { missing = [], returnTo = '/dashboard' } = location.state || {};

  const handleComplete = async (data) => {
    try {
      await user?.update({
        firstName: data.firstName,
        lastName: data.lastName,
        publicMetadata: {
          ...user.publicMetadata,
          ...data
        }
      });
      
      toast.success('Profile updated successfully');
      navigate(returnTo);
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-xl mx-auto px-4">
        {missing.includes('role') && (
          <RoleSelection 
            onSelect={async (role) => {
              await handleComplete({ role });
            }}
          />
        )}
        
        {(missing.includes('name') || missing.includes('contact')) && (
          <ProfileSetup 
            onComplete={handleComplete}
            initialData={user}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileCompletion;
