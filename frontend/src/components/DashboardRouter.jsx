import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import AgentDashboard from '../pages/dashboards/AgentDashboard';
import BuyerDashboard from '../pages/dashboards/BuyerDashboard';
import LoadingScreen from '../components/LoadingScreen';
import { ROLES } from '../utils/userRoles';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import { useRolePermissions } from '../hooks/useRolePermissions';
import { verifyUserRoles } from '../services/userService';
import InvestorDashboard from '../pages/dashboards/InvestorDashboard';
import { ProtectedRoute } from './ProtectedRoute';
import { PERMISSIONS } from '../utils/permissions';
import ListingsView from '../pages/ListingsView';
import CreateListing from '../pages/CreateListing';
import EditListing from '../pages/EditListing';
import TenantDashboard from '../pages/dashboards/TenantDashboard';
import PropertyOwnerDashboard from '../pages/dashboards/PropertyOwnerDashboard';
import Analytics from '../pages/Analytics';
import MaintenanceRequests from '../pages/MaintenanceRequests';

const LoadingState = ({ message }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">{message || 'Loading...'}</p>
    </div>
  </div>
);

const DashboardRouter = () => {
  const { isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();
  const { activeRole, roles } = useRolePermissions();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded || !user) return;
    
    const verifyRoles = async () => {
      try {
        const verification = await verifyUserRoles(user.id);
        
        if (verification.needsSync) {
          console.warn('⚠️ Role mismatch detected - attempting to sync...');
          await syncUserData({
            user,
            roles: verification.clerkData.roles,
            activeRole: verification.clerkData.activeRole
          });
        } else {
          console.log('✅ Roles verified and in sync');
        }
      } catch (error) {
        console.error('❌ Role verification failed:', error);
        // Don't show error to user unless absolutely necessary
        if (error.response?.status === 500) {
          toast.error('Unable to verify user roles. Please try again later.');
        }
      }
    };

    verifyRoles();
  }, [isLoaded, user]);

  if (!isLoaded) {
    return <LoadingState message="Loading..." />;
  }

  if (!isSignedIn || !user) {
    return <Navigate to="/sign-in" replace />;
  }

  const getDashboardComponent = () => {
    switch (activeRole) {
      case ROLES.ADMIN:
        return <AdminDashboard />;
      case ROLES.AGENT:
        return <AgentDashboard />;
      case ROLES.OWNER:
        return <PropertyOwnerDashboard />;
      case ROLES.INVESTOR:
        return <InvestorDashboard />;
      case ROLES.TENANT:
        return <TenantDashboard />;
      default:
        return <BuyerDashboard />;
    }
  };

  return (
    <DashboardLayout>
      <Routes>
        <Route index element={getDashboardComponent()} />
        <Route path="home" element={getDashboardComponent()} />
        <Route path="listings">
          <Route index element={
            <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_LISTINGS}>
              <ListingsView />
            </ProtectedRoute>
          } />
          <Route path="create" element={
            <ProtectedRoute requiredPermission={PERMISSIONS.CREATE_LISTING}>
              <CreateListing />
            </ProtectedRoute>
          } />
          <Route path="edit/:id" element={
            <ProtectedRoute requiredPermission={PERMISSIONS.EDIT_LISTING}>
              <EditListing />
            </ProtectedRoute>
          } />
        </Route>

        <Route path="analytics" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_ANALYTICS}>
            <Analytics />
          </ProtectedRoute>
        } />

        <Route path="maintenance" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.SUBMIT_MAINTENANCE}>
            <MaintenanceRequests />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default React.memo(DashboardRouter);
