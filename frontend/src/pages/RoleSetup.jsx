import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import RoleSelector from '../components/RoleSelector';
import { ROLES, DEFAULT_ROLE } from '../utils/userRoles';
import LoadingSpinner from '../components/LoadingSpinner';
import { updateUserRole } from '../services/roleService';

const RoleSetup = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [role, setRole] = useState(DEFAULT_ROLE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoaded) return <LoadingSpinner />;

  const handleRoleSubmit = async () => {
    try {
      setIsSubmitting(true);
      console.log('Setting up role:', { userId: user?.id, role });

      // Update both Clerk metadata and database
      await updateUserRole(user?.id, role);

      // Update Clerk user metadata
      await user?.update({
        publicMetadata: {
          role,
          setupComplete: true
        }
      });

      toast.success('Role setup complete!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Role setup error:', err);
      toast.error('Failed to set up role');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Choose Your Role</h2>
          <p className="mt-2 text-gray-600">Select how you'll use Homestead</p>
        </div>

        <RoleSelector 
          selectedRole={role} 
          onRoleSelect={setRole}
        />

        <button
          onClick={handleRoleSubmit}
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Setting up...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default RoleSetup;
