import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { FaListAlt, FaUserClock, FaChartLine, FaCalendarAlt, FaUsers, FaCog } from 'react-icons/fa';
import { getRandomBackground } from '../../utils/backgroundImages';

const StatsCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-primary/10 rounded-full">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      {trend && (
        <span className={`text-sm font-medium ${
          trend > 0 ? 'text-green-500' : 'text-red-500'
        }`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const AgentDashboard = ({ owner = false }) => {
  const { user } = useUser();
  const backgroundImage = getRandomBackground();

  const stats = [
    { title: 'Active Listings', value: '12', icon: FaListAlt, trend: 5 },
    { title: 'Pending Viewings', value: '8', icon: FaCalendarAlt, trend: -2 },
    { title: 'Active Clients', value: '24', icon: FaUsers, trend: 12 },
    { title: 'Monthly Revenue', value: '$15.2k', icon: FaChartLine, trend: 8 }
  ];

  return (
    <main className="w-full">
      {/* Hero Section */}
      <div 
        className="w-full h-[300px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50">
          <div className="max-padd-container h-full flex items-center">
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.firstName}
              </h1>
              <p className="text-xl opacity-90">
                {owner ? 'Manage Your Properties' : 'Your Real Estate Dashboard'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-padd-container py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Listings */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Listings</h2>
            {/* Add listings content */}
          </div>

          {/* Upcoming Viewings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Viewings</h2>
            {/* Add viewings content */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AgentDashboard;
