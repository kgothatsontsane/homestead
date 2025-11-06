import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { verifyUserRoles } from '../services/userService';
import { ROLES } from '../utils/userRoles';

export const useRoleVerification = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkRoles = async () => {
      if (!user) return;

      try {
        const { needsSync, clerkData } = await verifyUserRoles(user.id);
        const roles = clerkData?.roles || [];
        const hasUnsetRole = roles.includes(ROLES.UNSET) || roles.length === 0;

        if (hasUnsetRole || needsSync) {
          console.log('🚨 User needs role setup:', { roles, needsSync });
          navigate('/onboarding');
          return;
        }

        setIsVerified(true);
      } catch (error) {
        console.error('Role verification failed:', error);
        navigate('/onboarding');
      }
    };

    checkRoles();
  }, [user, navigate]);

  return isVerified;
};