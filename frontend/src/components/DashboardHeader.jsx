import { Link } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { RoleToggleButton } from './RoleToggleButton';
// ...existing imports...

const DashButton = ({ to, variant = 'default', children }) => {
  const baseClass = "rounded-lg px-4 py-2 transition-all duration-200 font-medium text-sm";
  const variants = {
    default: "text-gray-700 hover:bg-gray-100",
    primary: "bg-secondary text-white hover:bg-tertiary",
    outline: "border border-secondary text-secondary hover:bg-secondary hover:text-white"
  };
  
  return (
    <Link to={to} className={`${baseClass} ${variants[variant]}`}>
      {children}
    </Link>
  );
};

const DashboardHeader = () => {
  const { user } = useUser();
  const metadata = user?.unsafeMetadata || {};
  const currentRole = metadata.activeRole || 'buyer';
  const roles = metadata.roles || [currentRole];

  const navigationItems = React.useMemo(() => ({
    buyer: [
      { to: '/dashboard', label: 'My Dashboard', icon: 'home' },
      { to: '/saved', label: 'Saved Properties', icon: 'heart' },
      { to: '/viewings', label: 'My Viewings', icon: 'calendar' }
    ],
    agent: [
      { to: '/dashboard', label: 'Agent Dashboard', icon: 'briefcase' },
      { to: '/listings/manage', label: 'My Listings', icon: 'list' },
      { to: '/clients', label: 'Clients', icon: 'users' }
    ],
    owner: [
      { to: '/dashboard', label: 'Owner Dashboard', icon: 'home' },
      { to: '/properties', label: 'My Properties', icon: 'building' },
      { to: '/tenants', label: 'Tenants', icon: 'users' }
    ]
  }), []);

  const handleRoleSwitch = async (newRole) => {
    try {
      await user.update({
        unsafeMetadata: {
          ...metadata,
          activeRole: newRole,
          lastUpdated: new Date().toISOString()
        }
      });
      window.location.reload();
    } catch (error) {
      console.error('Failed to switch role:', error);
    }
  };

  return (
    <header className="bg-white border-b">
      <div className="max-padd-container py-4">
        <div className="flexBetween">
          {/* Role Switcher */}
          {roles.length > 1 && (
            <RoleToggleButton 
              currentRole={currentRole} 
              availableRoles={roles}
              onRoleSwitch={handleRoleSwitch}
            />
          )}

          {/* Role-specific Navigation */}
          <nav className="flex items-center gap-4">
            {navigationItems[currentRole]?.map(item => (
              <DashButton
                key={item.to}
                to={item.to}
                variant={location.pathname === item.to ? 'primary' : 'default'}
              >
                {item.label}
              </DashButton>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default React.memo(DashboardHeader);
