import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Import from contexts
import Login from './pages/Login';
import Profile from './components/Profile';
import SalesDashboard from './pages/SalesDashboard';
import ProjectOfficerDashboard from './pages/ProjectOfficerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Create a wrapper component for Profile to handle navigation
function ProfileWrapper() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
    />
  );
}

// Role-based dashboard selector
function DashboardSelector({ onLogout }) {
  const { user } = useAuth();
  
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

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  
  if (loading) {
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
  const { token, user, loading } = useAuth();
  
  if (loading) {
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
  const { token, user, loading } = useAuth();
  
  if (loading) {
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
  const { token, user, loading } = useAuth();
  
  if (loading) {
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

// Main App component that uses the auth context
function AppContent() {
  const { user, token, login, register, logout, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  // Show app-level loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

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
          
          {/* Main dashboard route */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardSelector onLogout={logout} />
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
          
          {/* Profile route */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfileWrapper />
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

// Wrap the main App with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;