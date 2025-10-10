import React from 'react';

const MeterIssueForm = ({ show, onClose, meterIssueForm, setMeterIssueForm, onSubmit, loading, error }) => {
  if (!show) return null;

  const issueTypes = [
  { value: 'valve_closed', label: 'Valve Closed' },
  { value: 'no_display', label: 'No Display' },
  { value: 'token_not_loading', label: 'Token Not Loading' },
  { value: 'leakage', label: 'Water Leakage' },
  { value: 'damaged_meter', label: 'Damaged Meter' },
  { value: 'other', label: 'Other' }
];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Report Meter Issue</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Meter ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meter ID *
            </label>
            <input
              type="text"
              value={meterIssueForm.meter_id}
              onChange={(e) => setMeterIssueForm({...meterIssueForm, meter_id: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              value={meterIssueForm.customer_name}
              onChange={(e) => setMeterIssueForm({...meterIssueForm, customer_name: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Customer Location */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Location *
            </label>
            <textarea
              value={meterIssueForm.customer_location}
              onChange={(e) => setMeterIssueForm({...meterIssueForm, customer_location: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
              required
            />
          </div>

          {/* Issue Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issue Type *
            </label>
            <select
  value={meterIssueForm.issue_type}
  onChange={(e) => setMeterIssueForm({...meterIssueForm, issue_type: e.target.value})}
  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  required
>
  <option value="">Select Issue Type</option>
  {issueTypes.map(type => (
    <option key={type.value} value={type.value}>{type.label}</option>
  ))}
</select>
          </div>

          {/* Severity Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severity Level *
            </label>
            <select
              value={meterIssueForm.severity_level}
              onChange={(e) => setMeterIssueForm({...meterIssueForm, severity_level: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={meterIssueForm.description}
              onChange={(e) => setMeterIssueForm({...meterIssueForm, description: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Describe the issue in detail..."
              required
            />
          </div>

          {/* Image Upload */}
          {/* Image Upload */}
<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Image Evidence (Optional)
  </label>
  <input
    type="file"
    accept="image/*,video/*"
    onChange={(e) => setMeterIssueForm({...meterIssueForm, evidence_image: e.target.files[0]})} // CHANGE TO evidence_image
    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Reporting...' : 'Report Issue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeterIssueForm;