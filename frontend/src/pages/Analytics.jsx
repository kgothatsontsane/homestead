import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { FaChartLine, FaUsers, FaMoneyBillWave, FaPercentage } from 'react-icons/fa';
import { DashboardMetric } from '../components/dashboard/DashboardCard';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(Tooltip, Legend);

const Analytics = () => {
  const metrics = {
    totalRevenue: 250000,
    activeListings: 15,
    occupancyRate: 85,
    monthlyGrowth: 12,
    totalViewings: 45,
    conversionRate: 8.5,
    averagePrice: 1850000,
    pendingOffers: 6
  };

  const chartData = {
    revenue: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Revenue',
        data: [30000, 35000, 32000, 40000, 45000, 50000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    propertyTypes: {
      labels: ['Houses', 'Apartments', 'Land', 'Commercial'],
      datasets: [{
        data: [35, 25, 20, 20],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(168, 85, 247, 0.8)'
        ]
      }]
    }
  };

  return (
    <div className="p-6 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <select className="form-select w-48">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardMetric
          label="Total Revenue"
          value={`R${metrics.totalRevenue.toLocaleString()}`}
          icon={FaMoneyBillWave}
          change={metrics.monthlyGrowth}
        />
        <DashboardMetric
          label="Active Listings"
          value={metrics.activeListings}
          icon={FaHome}
        />
        <DashboardMetric
          label="Occupancy Rate"
          value={`${metrics.occupancyRate}%`}
          icon={FaPercentage}
        />
        <DashboardMetric
          label="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          icon={FaChartLine}
          change={2.5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
          <Line data={chartData.revenue} />
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Property Distribution</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut data={chartData.propertyTypes} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
