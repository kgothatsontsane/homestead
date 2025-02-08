import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { BsHouseDoor, BsCalendar, BsChat, BsHeart, BsSearch } from 'react-icons/bs';
import { MdOutlineHistory } from 'react-icons/md';
import { getRandomBackground } from '../../utils/backgroundImages';

const QuickActionCard = ({ icon: Icon, title, description, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all cursor-pointer border border-gray-100"
  >
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-primary/10 rounded-full">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  </div>
);

const BuyerDashboard = () => {
  const { user } = useUser();
  const backgroundImage = getRandomBackground();

  const quickActions = [
    {
      icon: BsHouseDoor,
      title: "Browse Properties",
      description: "Find your dream home",
      path: "/listings"
    },
    {
      icon: BsHeart,
      title: "Saved Properties",
      description: "View your favorites",
      path: "/saved"
    },
    {
      icon: BsCalendar,
      title: "Upcoming Viewings",
      description: "Manage your appointments",
      path: "/viewings"
    },
    {
      icon: BsChat,
      title: "Messages",
      description: "Chat with agents",
      path: "/messages"
    }
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
            <div className="text-white max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 drop-shadow-lg">
                Welcome, {user?.firstName}!
              </h1>
              <p className="text-xl text-white/90 drop-shadow-md">
                Your Property Journey Starts Here
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-padd-container py-16">
        {/* Quick Actions Grid */}
        <div className="mb-16">
          <h2 className="heading-secondary mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quickActions.map((action, index) => (
              <QuickActionCard 
                key={index}
                icon={action.icon}
                title={action.title}
                description={action.description}
                onClick={() => window.location.href = action.path}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="heading-secondary mb-8">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            <div className="p-8">
              <p className="text-gray-600 text-center py-8 text-lg">No recent activity to show</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BuyerDashboard;
