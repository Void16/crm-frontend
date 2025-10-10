import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Profile from './components/Profile';
import SalesDashboard from './pages/SalesDashboard';
import ProjectOfficerDashboard from './pages/ProjectOfficerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Create a wrapper component for Profile to handle navigation
function ProfileWrapper({ user, onUpdateProfile }) {
  const navigate = useNavigate();
  
  // Add null check for user
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  const handleBack = () => {
    // Navigate back to the appropriate dashboard based on user role
    if (user.user_type === 'project_officer') {
      navigate('/project-officer-dashboard');
    } else if (user.user_type === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/sales-dashboard');
    }
  };

  return (
    <Profile 
      user={user} 
      onBack={handleBack} 
      onUpdateProfile={onUpdateProfile} 
    />
  );
}

// Role-based dashboard selector - ADD NULL CHECK
function DashboardSelector({ user, onLogout }) {
  // Add null check for user
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  switch (user.user_type) {
    case 'admin':
      return <AdminDashboard user={user} onLogout={onLogout} />;
    case 'project_officer':
      return <ProjectOfficerDashboard user={user} onLogout={onLogout} />;
    case 'employee':
    default:
      return <SalesDashboard user={user} onLogout={onLogout} />;
  }
}

function App() {
  const { user, token, login, register, logout } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [appLoading, setAppLoading] = useState(true); // Add app-level loading state

  // Add loading effect
  useEffect(() => {
    // Set loading to false once we have user data or know there's no user
    if (user !== undefined) { // Check if user data has been loaded (even if null)
      setAppLoading(false);
    }
  }, [user]);

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

  // Protected Route component - ADD NULL CHECK
  const ProtectedRoute = ({ children }) => {
    if (appLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }
    return token ? children : <Navigate to="/login" />;
  };

  // Role-based route protection
  const AdminRoute = ({ children }) => {
    if (appLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }
    return token && user?.user_type === 'admin' ? children : <Navigate to="/dashboard" />;
  };

  const ProjectOfficerRoute = ({ children }) => {
    if (appLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }
    return token && user?.user_type === 'project_officer' ? children : <Navigate to="/dashboard" />;
  };

  const SalesEmployeeRoute = ({ children }) => {
    if (appLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }
    return token && (user?.user_type === 'employee' || user?.user_type === 'sales') ? children : <Navigate to="/dashboard" />;
  };

  // Show app-level loading screen
  if (appLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  // Use Router for navigation
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login route */}
          <Route 
            path="/login" 
            element={
              token ? <Navigate to="/dashboard" /> : (
                <Login 
                  onLogin={login}
                  onRegister={register}
                  showRegister={showRegister}
                  onShowRegister={() => setShowRegister(true)}
                  onHideRegister={() => setShowRegister(false)}
                />
              )
            } 
          />
          
          {/* Redirect root to appropriate page */}
          <Route 
            path="/" 
            element={
              token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            } 
          />
          
          {/* Main dashboard route - automatically redirects based on role */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardSelector user={user} onLogout={logout} />
              </ProtectedRoute>
            } 
          />
          
          {/* Role-specific dashboard routes */}
          <Route 
            path="/sales-dashboard" 
            element={
              <SalesEmployeeRoute>
                <SalesDashboard user={user} onLogout={logout} />
              </SalesEmployeeRoute>
            } 
          />
          
          <Route 
            path="/project-officer-dashboard" 
            element={
              <ProjectOfficerRoute>
                <ProjectOfficerDashboard user={user} onLogout={logout} />
              </ProjectOfficerRoute>
            } 
          />
          
          <Route 
            path="/admin-dashboard" 
            element={
              <AdminRoute>
                <AdminDashboard user={user} onLogout={logout} />
              </AdminRoute>
            } 
          />
          
          {/* Profile route - accessible to all authenticated users */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfileWrapper 
                  user={user} 
                  onUpdateProfile={handleUpdateProfile} 
                />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;