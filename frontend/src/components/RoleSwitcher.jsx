import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRoleDisplay } from '../utils/userRoles';
import { syncUserData } from '../services/userService';
import { FaChevronDown } from 'react-icons/fa'; // Add this import

const RoleSwitcher = ({ currentRole, availableRoles, onRoleSwitch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const handleRoleSwitch = async (newRole) => {
    try {
      await syncUserData({
        user,
        activeRole: newRole,
        roles: availableRoles
      });
      onRoleSwitch(newRole);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to switch role:', error);
      toast.error('Failed to switch role');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
      >
        <span>{getRoleDisplay(currentRole)}</span>
        <FaChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-xl py-2"
          >
            {availableRoles.map(role => (
              <button
                key={role}
                onClick={() => handleRoleSwitch(role)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                  role === currentRole ? 'bg-gray-50 text-primary' : ''
                }`}
              >
                {getRoleDisplay(role)}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleSwitcher;
