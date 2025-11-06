
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { verifyUserRoles } from '../services/userService';

const RoleCheck = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      if (!user) return;
      
      const { needsSync, clerkData } = await verifyUserRoles(user.id);
      const roles = clerkData?.roles || [];
      const hasValidRole = roles.length > 0 && !roles.includes('unset');

      if (!hasValidRole || needsSync) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    };

    checkRole();
  }, [user, navigate]);

  return null; // This is just a routing component
};

export default RoleCheck;