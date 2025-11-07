import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { FaPlus, FaFilter } from 'react-icons/fa';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import { PERMISSIONS } from '../utils/permissions';
import { Link } from 'react-router-dom';

const ListingsView = () => {
  const { user } = useUser();
  const { can } = useFeatureAccess();

  return (
    <div className="p-6 space-y-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Property Listings</h1>
        {can(PERMISSIONS.CREATE_LISTING) && (
          <Link to="/dashboard/listings/create" className="btn-primary flex items-center gap-2">
            <FaPlus /> Add Listing
          </Link>
        )}
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-gray-500">No listings available</p>
        </div>
      </div>
    </div>
  );
};

export default ListingsView;
