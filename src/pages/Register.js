import React, { useState } from 'react';

const Register = ({ onRegister, onCancel }) => {
  const [registerForm, setRegisterForm] = useState({ 
    username: '', 
    password: '', 
    first_name: '', 
    last_name: '', 
    email: '',
    user_type: 'employee', // Default to Sales Employee
    phone: '',
    assigned_areas: '',
    specialization: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Generate unique IDs for each input
  const inputIds = {
    firstName: `register-first-name-${Date.now()}`,
    lastName: `register-last-name-${Date.now()}`,
    username: `register-username-${Date.now()}`,
    email: `register-email-${Date.now()}`,
    password: `register-password-${Date.now()}`,
    confirmPassword: `register-confirm-password-${Date.now()}`,
    userType: `register-user-type-${Date.now()}`,
    phone: `register-phone-${Date.now()}`,
    assignedAreas: `register-assigned-areas-${Date.now()}`,
    specialization: `register-specialization-${Date.now()}`
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Basic validation
    if (registerForm.password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (registerForm.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    // Project Officer specific validation
    if (registerForm.user_type === 'project_officer') {
      if (!registerForm.phone.trim()) {
        setError('Phone number is required for Project Officers');
        setLoading(false);
        return;
      }
      if (!registerForm.assigned_areas.trim()) {
        setError('Assigned areas are required for Project Officers');
        setLoading(false);
        return;
      }
    }
    
    const result = await onRegister(registerForm);
    
    if (!result.success) {
      setError(result.message);
    } else {
      onCancel();
    }
    
    setLoading(false);
  };

  const handleUserTypeChange = (userType) => {
    setRegisterForm({
      ...registerForm,
      user_type: userType,
      // Clear project officer fields if switching to sales employee
      ...(userType === 'employee' && { 
        phone: '', 
        assigned_areas: '', 
        specialization: '' 
      })
    });
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Role Selection */}
        <div>
          <label htmlFor={inputIds.userType} className="block text-sm font-medium text-gray-700 mb-3">
            Role *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleUserTypeChange('employee')}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                registerForm.user_type === 'employee'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="font-medium">Sales Employee</div>
              <div className="text-xs text-gray-500 mt-1">Customer management & sales</div>
            </button>
            
            <button
              type="button"
              onClick={() => handleUserTypeChange('project_officer')}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                registerForm.user_type === 'project_officer'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="font-medium">Project Officer</div>
              <div className="text-xs text-gray-500 mt-1">Meter issues & field work</div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={inputIds.firstName} className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              id={inputIds.firstName}
              type="text"
              name="first_name"
              value={registerForm.first_name}
              onChange={(e) => setRegisterForm({...registerForm, first_name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="given-name"
            />
          </div>
          <div>
            <label htmlFor={inputIds.lastName} className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              id={inputIds.lastName}
              type="text"
              name="last_name"
              value={registerForm.last_name}
              onChange={(e) => setRegisterForm({...registerForm, last_name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="family-name"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor={inputIds.username} className="block text-sm font-medium text-gray-700 mb-1">
            Username *
          </label>
          <input
            id={inputIds.username}
            type="text"
            name="username"
            value={registerForm.username}
            onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="username"
          />
        </div>
        
        <div>
          <label htmlFor={inputIds.email} className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            id={inputIds.email}
            type="email"
            name="email"
            value={registerForm.email}
            onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="email"
          />
        </div>

        {/* Project Officer Specific Fields */}
        {registerForm.user_type === 'project_officer' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-700">Project Officer Information</h3>
            
            <div>
              <label htmlFor={inputIds.phone} className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                id={inputIds.phone}
                type="tel"
                name="phone"
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="tel"
                placeholder="+1234567890"
              />
            </div>

            <div>
              <label htmlFor={inputIds.assignedAreas} className="block text-sm font-medium text-gray-700 mb-1">
                Assigned Areas *
              </label>
              <input
                id={inputIds.assignedAreas}
                type="text"
                name="assigned_areas"
                value={registerForm.assigned_areas}
                onChange={(e) => setRegisterForm({...registerForm, assigned_areas: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Downtown, West District, Industrial Zone"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple areas with commas</p>
            </div>

            <div>
              <label htmlFor={inputIds.specialization} className="block text-sm font-medium text-gray-700 mb-1">
                Specialization
              </label>
              <input
                id={inputIds.specialization}
                type="text"
                name="specialization"
                value={registerForm.specialization}
                onChange={(e) => setRegisterForm({...registerForm, specialization: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Meter Installation, Repair, Maintenance"
              />
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor={inputIds.password} className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <input
            id={inputIds.password}
            type="password"
            name="password"
            value={registerForm.password}
            onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength="8"
            autoComplete="new-password"
          />
        </div>
        
        <div>
          <label htmlFor={inputIds.confirmPassword} className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password *
          </label>
          <input
            id={inputIds.confirmPassword}
            type="password"
            name="confirm_password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="new-password"
          />
        </div>
        
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-2 px-4 rounded-lg text-white disabled:opacity-50 ${
              registerForm.user_type === 'project_officer' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Registering...' : `Register as ${registerForm.user_type === 'project_officer' ? 'Project Officer' : 'Sales Employee'}`}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;