import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { FaChartLine, FaBuilding, FaMoneyBillWave, FaCalculator, FaChartPie } from 'react-icons/fa';
import { DashboardCard, DashboardMetric } from '../../components/dashboard/DashboardCard';
import { InvestmentChart } from '../../components/dashboard/InvestmentChart';

const InvestorDashboard = () => {
  const { user } = useUser();

  const investorMetrics = {
    totalProperties: 5,
    totalValue: 2500000,
    monthlyIncome: 15000,
    roi: 8.5,
    occupancyRate: 95
  };

  const investorActions = [
    {
      icon: FaChartPie,
      title: "Portfolio Overview",
      description: `${investorMetrics.totalProperties} Properties • ${investorMetrics.occupancyRate}% Occupied`,
      path: "/portfolio"
    },
    {
      icon: FaMoneyBillWave,
      title: "Financial Overview",
      description: `Monthly Income: R${investorMetrics.monthlyIncome}`,
      path: "/finances"
    },
    {
      icon: FaBuilding,
      title: "Property Management",
      description: "Manage your investment properties",
      path: "/properties"
    },
    {
      icon: FaChartLine,
      title: "Investment Analytics",
      description: `ROI: ${investorMetrics.roi}%`,
      path: "/analytics"
    }
  ];

  return (
    <div className="p-6 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Investment Dashboard</h1>
        <div className="text-right">
          <p className="text-gray-600">Portfolio Value</p>
          <p className="text-2xl font-bold text-primary">
            R{investorMetrics.totalValue.toLocaleString()}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {investorActions.map((action, index) => (
          <DashboardCard key={index} {...action} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Portfolio Performance</h3>
          <InvestmentChart />
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          {/* Add transaction list component */}
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;
