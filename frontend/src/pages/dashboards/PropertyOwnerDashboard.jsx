import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { FaBuilding, FaUsers, FaMoneyBillWave, FaChartBar } from 'react-icons/fa';
import { DashboardCard } from '../../components/dashboard/DashboardCard';

const PropertyOwnerDashboard = () => {
  const { user } = useUser();

  const ownerMetrics = {
    totalProperties: 3,
    occupiedUnits: 5,
    totalUnits: 6,
    monthlyRevenue: 25000
  };

  const ownerActions = [
    {
      icon: FaBuilding,
      title: "My Properties",
      description: `${ownerMetrics.totalProperties} Properties`,
      path: "/dashboard/properties"
    },
    {
      icon: FaUsers,
      title: "Tenants",
      description: `${ownerMetrics.occupiedUnits}/${ownerMetrics.totalUnits} Units Occupied`,
      path: "/dashboard/tenants"
    },
    {
      icon: FaMoneyBillWave,
      title: "Revenue",
      description: `R${ownerMetrics.monthlyRevenue.toLocaleString()} Monthly`,
      path: "/dashboard/revenue"
    },
    {
      icon: FaChartBar,
      title: "Analytics",
      description: "View performance metrics",
      path: "/dashboard/analytics"
    }
  ];

  return (
    <div className="p-6 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Property Management</h1>
        <button className="btn-primary">Add Property</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ownerActions.map((action, index) => (
          <DashboardCard key={index} {...action} />
        ))}
      </div>
    </div>
  );
};

export default PropertyOwnerDashboard;
