import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { FaHome, FaBuilding, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: 'buyer',
      title: 'Home Buyer',
      icon: FaSearch,
      description: 'I want to browse and purchase properties'
    },
    {
      id: 'owner',
      title: 'Property Owner',
      icon: FaHome,
      description: 'I want to list and manage my own properties'
    },
    {
      id: 'agent',
      title: 'Real Estate Agent',
      icon: FaBuilding,
      description: 'I want to list and sell properties professionally'
    }
  ];

  const handleContinue = async () => {
    if (!selectedRole) {
      toast.error('Please select a role to continue');
      return;
    }

    try {
      await user?.update({
        publicMetadata: {
          role: selectedRole
        }
      });
      
      navigate('/onboarding/profile');
    } catch (error) {
      console.error('Error setting role:', error);
      toast.error('Failed to set role. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">How will you use Homestead?</h2>
          <p className="mt-2 text-gray-600">Select your primary role</p>
        </div>

        <div className="space-y-4 mt-8">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`w-full p-4 text-left border-2 rounded-xl transition-all ${
                selectedRole === role.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <role.icon className={`w-6 h-6 ${
                  selectedRole === role.id ? 'text-primary' : 'text-gray-400'
                }`} />
                <div>
                  <div className="font-medium text-gray-900">{role.title}</div>
                  <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
