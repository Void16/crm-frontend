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
    specialization: '',
    // Technician fields
    license_number: '',
    vehicle_number: '',
    hourly_rate: '',
    is_available: true,
    tools_equipment: ''
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
    specialization: `register-specialization-${Date.now()}`,
    // Technician IDs
    licenseNumber: `register-license-number-${Date.now()}`,
    vehicleNumber: `register-vehicle-number-${Date.now()}`,
    hourlyRate: `register-hourly-rate-${Date.now()}`,
    toolsEquipment: `register-tools-equipment-${Date.now()}`
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

    // Technician specific validation
    if (registerForm.user_type === 'technician') {
      if (!registerForm.phone.trim()) {
        setError('Phone number is required for Technicians');
        setLoading(false);
        return;
      }
      if (!registerForm.license_number.trim()) {
        setError('License number is required for Technicians');
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
      // Clear fields when switching roles
      ...(userType === 'employee' && { 
        phone: '', 
        assigned_areas: '', 
        specialization: '',
        license_number: '',
        vehicle_number: '',
        hourly_rate: '',
        tools_equipment: ''
      }),
      ...(userType === 'project_officer' && { 
        license_number: '',
        vehicle_number: '',
        hourly_rate: '',
        tools_equipment: ''
      }),
      ...(userType === 'technician' && { 
        assigned_areas: '', 
        specialization: ''
      })
    });
  };

  // Role selection options
  const roleOptions = [
    { 
      value: 'employee', 
      label: 'Sales Employee', 
      description: 'Customer management & sales',
      color: 'blue'
    },
    { 
      value: 'project_officer', 
      label: 'Project Officer', 
      description: 'Meter issues & field work',
      color: 'green'
    },
    { 
      value: 'technician', 
      label: 'Technician/Plumber', 
      description: 'Installation, repair & maintenance',
      color: 'purple'
    }
  ];

  const getButtonColor = (role) => {
    const roleOption = roleOptions.find(r => r.value === role);
    return roleOption ? roleOption.color : 'blue';
  };

  const getRoleDisplayName = () => {
    switch(registerForm.user_type) {
      case 'employee': return 'Sales Employee';
      case 'project_officer': return 'Project Officer';
      case 'technician': return 'Technician';
      default: return 'User';
    }
  };

  const getSubmitButtonColor = () => {
    switch(registerForm.user_type) {
      case 'project_officer': return 'bg-green-600 hover:bg-green-700';
      case 'technician': return 'bg-purple-600 hover:bg-purple-700';
      default: return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-600 mt-1">Join CRM BI Solutions</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Role Selection */}
        <div>
          <label htmlFor={inputIds.userType} className="block text-sm font-medium text-gray-700 mb-3">
            Select Your Role *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {roleOptions.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => handleUserTypeChange(role.value)}
                className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                  registerForm.user_type === role.value
                    ? `border-${role.color}-500 bg-${role.color}-50 text-${role.color}-700 shadow-sm`
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow'
                }`}
              >
                <div className="font-semibold">{role.label}</div>
                <div className="text-xs text-gray-500 mt-1">{role.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Personal Information</span>
          </div>
        </div>

        {/* Common Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              autoComplete="family-name"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label htmlFor={inputIds.phone} className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number {registerForm.user_type !== 'employee' ? '*' : ''}
          </label>
          <input
            id={inputIds.phone}
            type="tel"
            name="phone"
            value={registerForm.phone}
            onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required={registerForm.user_type !== 'employee'}
            autoComplete="tel"
            placeholder="+27 12 345 6789"
          />
        </div>

        {/* Project Officer Specific Fields */}
        {registerForm.user_type === 'project_officer' && (
          <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Project Officer Information
            </h3>
            
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Meter Installation, Repair, Maintenance"
              />
            </div>
          </div>
        )}

        {/* Technician Specific Fields */}
        {registerForm.user_type === 'technician' && (
          <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-800 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Technician Information
            </h3>
            
            <div>
              <label htmlFor={inputIds.licenseNumber} className="block text-sm font-medium text-gray-700 mb-1">
                License Number *
              </label>
              <input
                id={inputIds.licenseNumber}
                type="text"
                name="license_number"
                value={registerForm.license_number}
                onChange={(e) => setRegisterForm({...registerForm, license_number: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                required
                placeholder="e.g., PLB-12345"
              />
              <p className="text-xs text-gray-500 mt-1">Your professional plumbing/technician license number</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={inputIds.vehicleNumber} className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Registration
                </label>
                <input
                  id={inputIds.vehicleNumber}
                  type="text"
                  name="vehicle_number"
                  value={registerForm.vehicle_number}
                  onChange={(e) => setRegisterForm({...registerForm, vehicle_number: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="e.g., ABC 123 GP"
                />
              </div>
              
              <div>
                <label htmlFor={inputIds.hourlyRate} className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Rate (ZAR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">R</span>
                  <input
                    id={inputIds.hourlyRate}
                    type="number"
                    step="0.01"
                    min="0"
                    name="hourly_rate"
                    value={registerForm.hourly_rate}
                    onChange={(e) => setRegisterForm({...registerForm, hourly_rate: e.target.value})}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="150.00"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor={inputIds.toolsEquipment} className="block text-sm font-medium text-gray-700 mb-1">
                Tools & Equipment
              </label>
              <textarea
                id={inputIds.toolsEquipment}
                name="tools_equipment"
                value={registerForm.tools_equipment}
                onChange={(e) => setRegisterForm({...registerForm, tools_equipment: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                rows="2"
                placeholder="List your tools (comma-separated)..."
              />
              <p className="text-xs text-gray-500 mt-1">
                e.g., Pipe wrench, Pressure gauge, Soldering kit, Leak detector
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={registerForm.is_available}
                onChange={(e) => setRegisterForm({...registerForm, is_available: e.target.checked})}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                id="availability"
              />
              <label htmlFor="availability" className="ml-2 block text-sm text-gray-700">
                Available for immediate assignment
              </label>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Security</span>
          </div>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              minLength="8"
              autoComplete="new-password"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              autoComplete="new-password"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-6">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-3 px-4 rounded-lg text-white font-medium disabled:opacity-50 transition-colors duration-200 ${getSubmitButtonColor()}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : (
              `Register as ${getRoleDisplayName()}`
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>

        {/* Terms and Conditions */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            By registering, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>.
            <br />
            Your account will be verified before activation.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;