import React, { useState } from 'react';

const TechnicianAssignment = ({ show, onClose, issue, technicians, onAssign, loading, error }) => {
  const [formData, setFormData] = useState({
    technician_id: '',
    appointment_time: '',
    notes: ''
  });

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssign(issue.id, formData.technician_id, formData.appointment_time, formData.notes);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Assign Technician</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Technician *
              </label>
              <select
  value={formData.technician_id}
  onChange={(e) => setFormData({ ...formData, technician_id: e.target.value })}
  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  required
>
  <option value="">Select Technician</option>
  {technicians.map(tech => (
    <option key={tech.id} value={tech.id}>
      {tech.first_name} {tech.last_name}
    </option>
  ))}
</select>

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Appointment Time
              </label>
              <input
                type="datetime-local"
                value={formData.appointment_time}
                onChange={(e) => setFormData({...formData, appointment_time: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Additional notes for the technician..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Assigning...' : 'Assign Technician'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TechnicianAssignment;