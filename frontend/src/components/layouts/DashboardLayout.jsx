import React from 'react';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import RoleSwitcher from '../RoleSwitcher';

const DashboardLayout = ({ children }) => {
  const { activeRole, roles, setActiveRole } = useRolePermissions();

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* ...existing nav content... */}
            <div className="flex items-center">
              <RoleSwitcher
                currentRole={activeRole}
                availableRoles={roles}
                onRoleSwitch={setActiveRole}
              />
            </div>
          </div>
        </div>
      </nav>
      
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default React.memo(DashboardLayout);
