import React from 'react';
import { FaHome, FaBuilding, FaSearch } from 'react-icons/fa';
import { ROLES } from '../../../utils/userRoles';

const RoleSelection = ({ onSelect, selectedRole }) => {
  const roles = [
    {
      id: ROLES.BUYER,
      title: 'Home Buyer',
      icon: FaSearch,
      description: 'I want to browse and purchase properties'
    },
    {
      id: ROLES.OWNER,
      title: 'Property Owner',
      icon: FaHome,
      description: 'I want to list and manage my own properties'
    },
    {
      id: ROLES.AGENT,
      title: 'Real Estate Agent',
      icon: FaBuilding,
      description: 'I want to list and sell properties professionally'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Choose Your Role</h2>
        <p className="mt-2 text-gray-600">Select how you'll use Homestead</p>
      </div>

      <div className="space-y-4">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => onSelect(role.id)}
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
    </div>
  );
};

// Fix: Add proper export
export default RoleSelection;
