import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from '@clerk/clerk-react';
import RoleSelector from '../components/RoleSelector';
import { ROLES, DEFAULT_ROLE } from '../utils/userRoles';
import LoadingSpinner from '../components/LoadingSpinner';

const SignUp = () => {
  const { isLoaded, signUp } = useSignUp();
  const navigate = useNavigate();
  const [role, setRole] = useState(DEFAULT_ROLE);
  const [step, setStep] = useState(1);
  
  if (!isLoaded) return <LoadingSpinner />;

  const handleRoleSubmit = async () => {
    try {
      await signUp.update({
        publicMetadata: { role }
      });
      setStep(2);
    } catch (err) {
      console.error('Error updating role:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 p-6 bg-white rounded-xl shadow-xl">
      {step === 1 ? (
        <>
          <RoleSelector 
            selectedRole={role} 
            onRoleSelect={setRole} 
          />
          <button
            onClick={handleRoleSubmit}
            className="w-full mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Continue
          </button>
        </>
      ) : (
        <SignUpForm role={role} />
      )}
    </div>
  );
};

export default SignUp;
