import React, { useState, useEffect } from 'react';
import { Shield, QrCode, Key, User, Mail, Save, X, ArrowLeft } from 'lucide-react';
import { authAPI } from '../services/api';

const Profile = ({ user, onBack }) => {
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFASetupData, setTwoFASetupData] = useState(null);
  const [show2FADisable, setShow2FADisable] = useState(false);
  const [disableToken, setDisableToken] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await authAPI.updateProfile(profileData);
      
      if (result?.ok) {
        setMessage('Profile updated successfully!');
        // Update local user data
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        window.location.reload(); // Refresh to show updated data
      } else {
        setMessage(result?.data?.error || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('Network error occurred');
    }
    
    setLoading(false);
  };

  const handleSetup2FA = async () => {
    try {
      const result = await authAPI.twoFactorSetup();
      
      if (result?.ok) {
        setTwoFASetupData(result.data);
        setShow2FASetup(true);
      } else {
        setMessage('Failed to load 2FA setup');
      }
    } catch (error) {
      setMessage('Failed to load 2FA setup');
    }
  };

  const handleVerify2FA = async (token) => {
    try {
      const result = await authAPI.verify2FA(token);
      
      if (result?.ok) {
        setMessage('2FA enabled successfully!');
        setShow2FASetup(false);
        window.location.reload();
      } else {
        throw new Error(result?.data?.error || 'Verification failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleDisable2FA = async (token) => {
    try {
      const result = await authAPI.disable2FA(token);
      
      if (result?.ok) {
        setMessage('2FA disabled successfully!');
        setShow2FADisable(false);
        setDisableToken('');
        window.location.reload();
      } else {
        throw new Error(result?.data?.error || 'Failed to disable 2FA');
      }
    } catch (error) {
      throw error;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-xl font-semibold text-gray-800">My Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded ${
            message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <User className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Profile Settings</h2>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={profileData.first_name}
                    onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={profileData.last_name}
                    onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save size={16} className="mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Security Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">
                    {user.is_2fa_enabled 
                      ? '2FA is enabled for your account' 
                      : 'Add an extra layer of security to your account'
                    }
                  </p>
                </div>
                
                {user.is_2fa_enabled ? (
                  <button
                    onClick={() => setShow2FADisable(true)}
                    className="bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 text-sm"
                  >
                    Disable 2FA
                  </button>
                ) : (
                  <button
                    onClick={handleSetup2FA}
                    className="bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 text-sm flex items-center"
                  >
                    <QrCode size={16} className="mr-2" />
                    Enable 2FA
                  </button>
                )}
              </div>

              {user.is_2fa_enabled && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">2FA is Active</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Your account is protected with two-factor authentication.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2FA Setup Modal */}
      {show2FASetup && (
        <TwoFASetupModal 
          data={twoFASetupData} 
          onClose={() => setShow2FASetup(false)}
          onVerify={handleVerify2FA}
        />
      )}

      {/* 2FA Disable Modal */}
      {show2FADisable && (
        <TwoFADisableModal 
          onClose={() => setShow2FADisable(false)}
          onDisable={handleDisable2FA}
        />
      )}
    </div>
  );
};

// 2FA Setup Modal Component
const TwoFASetupModal = ({ data, onClose, onVerify }) => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (token.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onVerify(token);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Setup Two-Factor Authentication</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)
          </div>
          
          <div className="flex justify-center">
            <img src={data.qr_code} alt="QR Code" className="w-48 h-48" />
          </div>
          
          <div className="text-center">
            <p className="text-sm font-mono bg-gray-100 p-2 rounded">
              {data.secret_key}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Or enter this code manually in your app
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter 6-digit code to verify
            </label>
            <input
              type="text"
              maxLength="6"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="000000"
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleVerify}
              disabled={loading || token.length !== 6}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Enable'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2FA Disable Modal Component
const TwoFADisableModal = ({ onClose, onDisable }) => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDisable = async () => {
    if (token.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onDisable(token);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Disable Two-Factor Authentication</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            To disable 2FA, please enter the 6-digit code from your authenticator app.
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">6-digit code</label>
            <input
              type="text"
              maxLength="6"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="000000"
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={handleDisable}
              disabled={loading || token.length !== 6}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Disabling...' : 'Disable 2FA'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;