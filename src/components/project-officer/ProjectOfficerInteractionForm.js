import React, { useState } from 'react';
import { MapPin, MessageCircle, Calendar } from 'lucide-react';

const ProjectOfficerInteractionForm = ({ 
  show, 
  onClose, 
  onSubmit, 
  loading, 
  error,
  assignedArea 
}) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    location: '',
    interaction_type: 'site_visit',
    notes: '',
    follow_up_required: false,
    follow_up_date: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Include assigned area in the submission
    const submissionData = {
      ...formData,
      assigned_area: assignedArea,
      interaction_date: new Date().toISOString()
    };
    
    onSubmit(submissionData);
  };

  const handleClose = () => {
    setFormData({
      customer_name: '',
      location: '',
      interaction_type: 'site_visit',
      notes: '',
      follow_up_required: false,
      follow_up_date: ''
    });
    onClose();
  };

  if (!show) return null;

  const interactionTypes = [
    { value: 'site_visit', label: 'Site Visit' },
    { value: 'phone_call', label: 'Phone Call' },
    { value: 'email', label: 'Email' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'maintenance_check', label: 'Maintenance Check' },
    { value: 'customer_support', label: 'Customer Support' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Record Field Interaction</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {assignedArea && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <div className="flex items-center text-sm text-blue-800">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Assigned Area: <strong>{assignedArea}</strong></span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer/Business Name
              </label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter customer or business name"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter specific location or address"
              />
            </div>

            {/* Interaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interaction Type
              </label>
              <select
                value={formData.interaction_type}
                onChange={(e) => setFormData({...formData, interaction_type: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {interactionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interaction Details
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Describe the interaction, findings, or discussion..."
                required
              />
            </div>

            {/* Follow Up Required */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="follow_up_required"
                checked={formData.follow_up_required}
                onChange={(e) => setFormData({...formData, follow_up_required: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="follow_up_required" className="ml-2 block text-sm text-gray-700">
                Follow-up required
              </label>
            </div>

            {/* Follow Up Date */}
            {formData.follow_up_required && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  value={formData.follow_up_date}
                  onChange={(e) => setFormData({...formData, follow_up_date: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.notes.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Recording...' : 'Record Interaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectOfficerInteractionForm;