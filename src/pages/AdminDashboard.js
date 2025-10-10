import React from 'react';
import Dashboard from './Dashboard';

const AdminDashboard = ({ user, onLogout }) => {
  return <Dashboard user={user} onLogout={onLogout} />;
};

export default AdminDashboard;