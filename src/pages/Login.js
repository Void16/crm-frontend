import React, { useState } from 'react';
import { Eye, EyeOff, Building2, Shield } from 'lucide-react';
import Modal from '../components/common/Modal';
import Register from './Register';

const Login = ({ onLogin, onRegister, showRegister, onShowRegister, onHideRegister }) => {
  const [loginForm, setLoginForm] = useState({ username: '', password: '', token: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await onLogin(loginForm);
    
    if (result.requires_2fa) {
      setRequires2FA(true);
    } else if (!result.success) {
      setError(result.message);
      setRequires2FA(false);
    } else {
      setRequires2FA(false);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/bi.ico" 
            alt="Bhungane Investments Logo" 
            className="mx-auto h-23 w-23 mb-4" 
          />
          <h1 className="text-2xl font-bold text-gray-800">Bhungane Investments</h1>
          <p className="text-gray-600">Please login to continue</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              required
              autoComplete="username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* 2FA Token Input - Only shown when required */}
          {requires2FA && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Shield size={16} className="text-yellow-600 mr-2" />
                <span className="font-medium text-yellow-800">Two-Factor Authentication Required</span>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  Enter 6-digit code from your authenticator app
                </label>
                <input
                  type="text"
                  maxLength="6"
                  value={loginForm.token}
                  onChange={(e) => setLoginForm({
                    ...loginForm, 
                    token: e.target.value.replace(/[^0-9]/g, '')
                  })}
                  className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="000000"
                  autoComplete="one-time-code"
                />
                <p className="text-xs text-yellow-600 mt-1">
                  Open your authenticator app to get the current code
                </p>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>Logging in...</>
            ) : requires2FA ? (
              <>
                <Shield size={16} className="mr-2" />
                Verify & Login
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={onShowRegister}
            className="text-blue-600 hover:underline text-sm"
          >
            Don't have an account? Register here
          </button>
        </div>
      </div>

      <Modal show={showRegister} onClose={onHideRegister} title="Register Employee">
        <Register onRegister={onRegister} onCancel={onHideRegister} />
      </Modal>
    </div>
  );
};

export default Login;