import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const DashboardCard = ({ icon: Icon, title, description, path }) => (
  <Link to={path}>
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-100"
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </motion.div>
  </Link>
);

export const DashboardMetric = ({ label, value, icon: Icon, change }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
          </p>
        )}
      </div>
      {Icon && (
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      )}
    </div>
  </div>
);
