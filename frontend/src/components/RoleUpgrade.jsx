import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../hooks/useNavigation';
import { FaBuilding, FaUserTie } from 'react-icons/fa';
import { updateUserProfile } from '../services/userService';

const RoleUpgrade = () => {
  const { handleRoleUpgrade } = useNavigation();
  const navigate = useNavigate();

  const roleOptions = [
    {
      id: 'owner',
      title: 'Property Owner',
      icon: FaBuilding,
      description: 'List and manage your own properties'
    },
    {
      id: 'agent',
      title: 'Real Estate Agent',
      icon: FaUserTie,
      description: 'List and sell properties professionally'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6">
      <h2 className="text-2xl font-bold mb-6">Upgrade Your Role</h2>
      <p className="text-gray-600 mb-8">
        Select a role to gain listing capabilities:
      </p>

      <div className="space-y-4">
        {roleOptions.map(({ id, title, icon: Icon, description }) => (
          <button
            key={id}
            onClick={() => handleRoleUpgrade(id)}
            className="w-full p-4 border rounded-lg hover:bg-gray-50 text-left flex items-start gap-4"
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="text-xl text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-gray-600 text-sm">{description}</p>
            </div>
          </button>
        ))}

        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RoleUpgrade;
