import { useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import { getUserRole } from '../utils/roleUtils';
import { updateUserRole } from '../services/roleService';
import { checkProfileCompletion } from '../utils/profileUtils';

export const useNavigation = () => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useClerk();
  const { signIn } = useClerk();

  const handleRoleUpgrade = async (newRole) => {
    try {
      console.log('🔄 Starting role upgrade process:', { 
        userId: user?.id, 
        currentRole: user?.publicMetadata?.role,
        newRole 
      });

      const result = await updateUserRole(
        user?.id,
        newRole,
        user?.publicMetadata?.role
      );

      console.log('✅ Role upgrade complete:', result);
      
      toast.success(`Your role has been updated to ${newRole}`);
      navigate('/create-listing', { replace: true });

    } catch (error) {
      console.error('❌ Role upgrade failed:', error);
      toast.error('Failed to update role. Please try again.');
    }
  };

  const handleIncompleteProfile = (missing) => {
    const messages = {
      role: 'Please set your role first',
      name: 'Please complete your profile',
      contact: 'Please add your contact information',
      all: 'Please complete your profile setup'
    };

    const message = messages[missing[0]] || messages.all;
    toast.warning(message);
    navigate('/onboarding/profile-completion', { 
      state: { missing, returnTo: window.location.pathname }
    });
  };

  const handleAddHome = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!isSignedIn) {
      toast.info('Please sign in to create a listing');
      signIn?.();
      return;
    }

    const { isComplete, missing } = checkProfileCompletion(user);
    
    if (!isComplete) {
      handleIncompleteProfile(missing);
      return;
    }

    const role = getUserRole(user);
    console.log('Current role:', role);

    if (role === 'buyer') {
      // Show role upgrade confirmation
      const upgradeConfirmed = window.confirm(
        'You need to be an agent or owner to create listings. Would you like to upgrade your role?'
      );
      
      if (upgradeConfirmed) {
        navigate('/dashboard/settings/role-upgrade');
      }
      return;
    }

    if (role === 'agent' || role === 'owner') {
      navigate('/create-listing', { replace: true });
    }
  };

  return { handleAddHome, handleRoleUpgrade };
};
