import React from 'react';
import Dashboard from './Dashboard';

const SalesDashboard = ({ user, onLogout }) => {
  return <Dashboard user={user} onLogout={onLogout} />;
};

export default SalesDashboard;