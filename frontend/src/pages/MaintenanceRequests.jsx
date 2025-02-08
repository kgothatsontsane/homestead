import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { FaTools, FaCheck, FaClock, FaTimes } from 'react-icons/fa';

const RequestCard = ({ request }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold">{request.title}</h3>
        <p className="text-sm text-gray-600">{request.description}</p>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs ${
        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
        request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
        'bg-green-100 text-green-800'
      }`}>
        {request.status}
      </span>
    </div>
    <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
      <span>Unit: {request.unit}</span>
      <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
    </div>
  </div>
);

const MaintenanceRequests = () => {
  const { user } = useUser();
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    priority: 'normal',
    unit: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add submission logic
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'normal', label: 'Normal Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'emergency', label: 'Emergency' }
  ];

  const renderRequestForm = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Submit New Request</h2>
        <button 
          onClick={() => setShowForm(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={newRequest.title}
            onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
            className="form-input w-full"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Unit Number</label>
            <input
              type="text"
              value={newRequest.unit}
              onChange={(e) => setNewRequest(prev => ({ ...prev, unit: e.target.value }))}
              className="form-input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              value={newRequest.priority}
              onChange={(e) => setNewRequest(prev => ({ ...prev, priority: e.target.value }))}
              className="form-select w-full"
              required
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={newRequest.description}
            onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
            className="form-textarea w-full"
            rows={4}
            required
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Maintenance Requests</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FaTools /> New Request
        </button>
      </header>
      
      {showForm && renderRequestForm()}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Requests</h2>
          {requests
            .filter(r => r.status !== 'completed')
            .map(request => (
              <RequestCard key={request.id} request={request} />
            ))
          }
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Completed Requests</h2>
          {requests
            .filter(r => r.status === 'completed')
            .map(request => (
              <RequestCard key={request.id} request={request} />
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default MaintenanceRequests;
