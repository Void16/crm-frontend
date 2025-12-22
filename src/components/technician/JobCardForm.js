import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Phone, Mail, FileText, AlertCircle } from 'lucide-react';

const JobCardForm = ({ show, onClose, onSubmit, jobCard, loading, error }) => {
  const [form, setForm] = useState({
    customer_name: '',
    customer_address: '',
    customer_phone: '',
    customer_email: '',
    meter_number: '',
    meter_type: '',
    meter_reading: '',
    job_type: 'installation',
    job_description: '',
    scheduled_date: '',
    due_date: '',
    latitude: '',
    longitude: '',
    priority: 'medium', // ✅ ADDED
    location_notes: '', // ✅ ADDED
    emergency_contact_name: '', // ✅ ADDED
    emergency_contact_phone: '', // ✅ ADDED
  });

  useEffect(() => {
    if (jobCard) {
      setForm({
        customer_name: jobCard.customer_name || '',
        customer_address: jobCard.customer_address || '',
        customer_phone: jobCard.customer_phone || '',
        customer_email: jobCard.customer_email || '',
        meter_number: jobCard.meter_number || '',
        meter_type: jobCard.meter_type || '',
        meter_reading: jobCard.meter_reading || '',
        job_type: jobCard.job_type || 'installation',
        job_description: jobCard.job_description || '',
        scheduled_date: jobCard.scheduled_date || '',
        due_date: jobCard.due_date || '', // ✅ ADDED
        latitude: jobCard.latitude || '',
        longitude: jobCard.longitude || '',
        priority: jobCard.priority || 'medium', // ✅ ADDED
        location_notes: jobCard.location_notes || '', // ✅ ADDED
        emergency_contact_name: jobCard.emergency_contact_name || '', // ✅ ADDED
        emergency_contact_phone: jobCard.emergency_contact_phone || '', // ✅ ADDED
      });
    } else {
      setForm({
        customer_name: '',
        customer_address: '',
        customer_phone: '',
        customer_email: '',
        meter_number: '',
        meter_type: '',
        meter_reading: '',
        job_type: 'installation',
        job_description: '',
        scheduled_date: '',
        due_date: '', // ✅ ADDED
        latitude: '',
        longitude: '',
        priority: 'medium', // ✅ ADDED
        location_notes: '', // ✅ ADDED
        emergency_contact_name: '', // ✅ ADDED
        emergency_contact_phone: '', // ✅ ADDED
      });
    }
  }, [jobCard]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean up the data before submitting
    const cleanedData = {
      ...form,
      // Convert empty strings to null for optional fields
      customer_email: form.customer_email || '',
      meter_reading: form.meter_reading || '',
      scheduled_date: form.scheduled_date || null,
      due_date: form.due_date || null,
      latitude: form.latitude || null,
      longitude: form.longitude || null,
      location_notes: form.location_notes || '',
      emergency_contact_name: form.emergency_contact_name || '',
      emergency_contact_phone: form.emergency_contact_phone || '',
    };
    
    console.log('🔧 Submitting job card form data:', cleanedData);
    onSubmit(cleanedData);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm({
            ...form,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {jobCard ? 'Edit Job Card' : 'Create Job Card'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Customer Details */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Customer Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={form.customer_name}
                    onChange={(e) => setForm({...form, customer_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={form.customer_phone}
                    onChange={(e) => setForm({...form, customer_phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    value={form.customer_address}
                    onChange={(e) => setForm({...form, customer_address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.customer_email}
                    onChange={(e) => setForm({...form, customer_email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Meter Details */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-3">
                Meter Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meter Number *
                  </label>
                  <input
                    type="text"
                    value={form.meter_number}
                    onChange={(e) => setForm({...form, meter_number: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meter Type
                  </label>
                  <input
                    type="text"
                    value={form.meter_type}
                    onChange={(e) => setForm({...form, meter_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Prepaid Water Meter"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meter Reading
                  </label>
                  <input
                    type="text"
                    value={form.meter_reading}
                    onChange={(e) => setForm({...form, meter_reading: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Job Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type *
                  </label>
                  <select
                    value={form.job_type}
                    onChange={(e) => setForm({...form, job_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  >
                    <option value="installation">Installation</option>
                    <option value="repair">Repair</option>
                    <option value="replacement">Replacement</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inspection">Inspection</option>
                    <option value="emergency">Emergency</option> {/* ✅ ADDED */}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority *
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({...form, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={form.scheduled_date}
                    onChange={(e) => setForm({...form, scheduled_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={form.due_date}
                    onChange={(e) => setForm({...form, due_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description *
                  </label>
                  <textarea
                    value={form.job_description}
                    onChange={(e) => setForm({...form, job_description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    rows="3"
                    required
                    placeholder="Describe the job requirements..."
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium text-orange-800 mb-3 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Additional Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Notes
                  </label>
                  <textarea
                    value={form.location_notes}
                    onChange={(e) => setForm({...form, location_notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows="2"
                    placeholder="Additional location instructions..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={form.emergency_contact_name}
                    onChange={(e) => setForm({...form, emergency_contact_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Optional"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={form.emergency_contact_phone}
                    onChange={(e) => setForm({...form, emergency_contact_phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Location (Optional)
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={form.latitude}
                    onChange={(e) => setForm({...form, latitude: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., -25.7479"
                  />
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    value={form.longitude}
                    onChange={(e) => setForm({...form, longitude: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 28.2293"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Get Current Location
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (jobCard ? 'Update Job Card' : 'Create Job Card')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobCardForm;