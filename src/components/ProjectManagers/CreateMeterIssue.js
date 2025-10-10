// components/ProjectManagers/CreateMeterIssue.js
import React, { useState } from 'react';
import api from '../../services/api';

const CreateMeterIssue = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    meter_id: '',
    customer_name: '',
    customer_location: '',
    issue_type: 'valve_closed',
    severity_level: 'medium',
    description: ''
  });

  const issueTypes = [
    { value: 'valve_closed', label: 'Valve Closed' },
    { value: 'no_display', label: 'No Display' },
    { value: 'token_not_loading', label: 'Token Not Loading' },
    { value: 'leakage', label: 'Water Leakage' },
    { value: 'damaged_meter', label: 'Damaged Meter' },
    { value: 'other', label: 'Other' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/project-managers/meter-issues/', formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating issue:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Meter ID"
        value={formData.meter_id}
        onChange={(e) => setFormData({...formData, meter_id: e.target.value})}
        required
      />
      
      <input
        type="text"
        placeholder="Customer Name"
        value={formData.customer_name}
        onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
        required
      />
      
      <input
        type="text"
        placeholder="Customer Location"
        value={formData.customer_location}
        onChange={(e) => setFormData({...formData, customer_location: e.target.value})}
        required
      />

      <select
        value={formData.issue_type}
        onChange={(e) => setFormData({...formData, issue_type: e.target.value})}
      >
        {issueTypes.map(type => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      <select
        value={formData.severity_level}
        onChange={(e) => setFormData({...formData, severity_level: e.target.value})}
      >
        {severityLevels.map(level => (
          <option key={level.value} value={level.value}>
            {level.label}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Issue Description"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        required
      />

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Report Issue
      </button>
    </form>
  );
};