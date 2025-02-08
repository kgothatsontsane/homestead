import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from 'some-auth-library';
import RoleSwitcher from './RoleSwitcher';

const Navigation = () => {
  const { user } = useUser();
  const metadata = user?.unsafeMetadata || {};
  const currentRole = metadata.activeRole;
  const hasMultipleRoles = metadata.roles?.length > 1;

  const getNavItems = () => {
    const commonItems = [
      { to: '/', label: 'Home' },
      { to: '/listings', label: 'Listings' }
    ];

    const roleSpecificItems = {
      buyer: [
        { to: '/viewings', label: 'My Viewings' },
        { to: '/favorites', label: 'Saved Properties' }
      ],
      agent: [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/listings/manage', label: 'My Listings' }
      ],
      owner: [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/properties', label: 'My Properties' }
      ]
    };

    return [...commonItems, ...(roleSpecificItems[currentRole] || [])];
  };

  return (
    <nav>
      {/* ...existing nav structure... */}
      <div className="flex items-center gap-4">
        {getNavItems().map(item => (
          <NavLink key={item.to} to={item.to}>
            {item.label}
          </NavLink>
        ))}
        {hasMultipleRoles && (
          <RoleSwitcher 
            currentRole={currentRole}
            availableRoles={metadata.roles || []}
          />
        )}
      </div>
    </nav>
  );
};

export default React.memo(Navigation);
