import React from 'react';
import Dashboard from './Dashboard';

const ProjectOfficerDashboard = ({ user, onLogout }) => {
  return <Dashboard user={user} onLogout={onLogout} />;
};

export default ProjectOfficerDashboard;