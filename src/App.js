import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './components/Profile'; // Add this import

function App() {
  const { user, token, login, register, logout } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  // Add the profile update function
  const handleUpdateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/employees/update_profile/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const error = await response.json();
        return { success: false, message: error.detail || 'Update failed' };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/" />;
  };

  if (!token) {
    return (
      <Login 
        onLogin={login}
        onRegister={register}
        showRegister={showRegister}
        onShowRegister={() => setShowRegister(true)}
        onHideRegister={() => setShowRegister(false)}
      />
    );
  }

  // Use Router for navigation
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard user={user} onLogout={logout} />} />
          <Route path="/dashboard" element={<Dashboard user={user} onLogout={logout} />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile user={user} onUpdateProfile={handleUpdateProfile} />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;