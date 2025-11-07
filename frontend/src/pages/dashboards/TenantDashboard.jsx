import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { FaHome, FaFileContract, FaTools, FaMoneyBillWave } from 'react-icons/fa';
import { DashboardCard } from '../../components/dashboard/DashboardCard';

const TenantDashboard = () => {
  const { user } = useUser();

  const tenantActions = [
    {
      icon: FaHome,
      title: "Current Rentals",
      description: "View your active rental properties",
      path: "/dashboard/rentals"
    },
    {
      icon: FaFileContract,
      title: "Lease Documents",
      description: "Access your lease agreements",
      path: "/dashboard/documents"
    },
    {
      icon: FaTools,
      title: "Maintenance",
      description: "Submit and track maintenance requests",
      path: "/dashboard/maintenance"
    },
    {
      icon: FaMoneyBillWave,
      title: "Payments",
      description: "View and manage rent payments",
      path: "/dashboard/payments"
    }
  ];

  return (
    <div className="p-6 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome, {user?.firstName}</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tenantActions.map((action, index) => (
          <DashboardCard key={index} {...action} />
        ))}
      </div>
    </div>
  );
};

export default TenantDashboard;
