import React, { useState } from 'react';

const Register = ({ onRegister, onCancel }) => {
  const [registerForm, setRegisterForm] = useState({ 
    username: '', 
    password: '', 
    first_name: '', 
    last_name: '', 
    email: '' 
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
    confirmPassword: `register-confirm-password-${Date.now()}`
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
    
    const result = await onRegister(registerForm);
    
    if (!result.success) {
      setError(result.message);
    } else {
      onCancel();
    }
    
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
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
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
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