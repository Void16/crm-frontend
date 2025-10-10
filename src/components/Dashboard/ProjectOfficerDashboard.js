// components/Dashboard/ProjectOfficerDashboard.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import MeterIssueList from '../ProjectManagers/MeterIssueList';
import CreateMeterIssue from '../ProjectManagers/CreateMeterIssue';

const ProjectOfficerDashboard = () => {
  const [activeTab, setActiveTab] = useState('my-issues');
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const fetchMyIssues = async () => {
    try {
      const response = await api.get('/project-managers/meter-issues/my_issues/');
      setIssues(response.data);
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  return (
    <div className="dashboard">
      <h1>Project Officer Dashboard</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === 'my-issues' ? 'active' : ''}
          onClick={() => setActiveTab('my-issues')}
        >
          My Issues
        </button>
        <button 
          className={activeTab === 'report-issue' ? 'active' : ''}
          onClick={() => setActiveTab('report-issue')}
        >
          Report New Issue
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'my-issues' && (
          <MeterIssueList issues={issues} onUpdate={fetchMyIssues} />
        )}
        {activeTab === 'report-issue' && (
          <CreateMeterIssue onSuccess={() => {
            setActiveTab('my-issues');
            fetchMyIssues();
          }} />
        )}
      </div>
    </div>
  );
};