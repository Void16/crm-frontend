// src/components/collaboration/TeamCollaboration.js
import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, FileText, Activity } from 'lucide-react';
import TeamChat from './TeamChat';
import SharedNotes from './SharedNotes';
import ActivityFeed from './ActivityFeed';
import { collaborationAPI } from '../../services/api';

const TeamCollaboration = ({ user }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [channels, setChannels] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [channelsResult, notesResult, activitiesResult] = await Promise.all([
        collaborationAPI.getChannels(),
        collaborationAPI.getNotes(),
        collaborationAPI.getActivities()
      ]);

      if (channelsResult?.ok) setChannels(channelsResult.data);
      if (notesResult?.ok) setNotes(notesResult.data);
      if (activitiesResult?.ok) setActivities(activitiesResult.data);
      
      if (!channelsResult?.ok && channelsResult?.status !== 404) {
        setError('Failed to load collaboration data');
      }
    } catch (error) {
      console.error('Error fetching collaboration data:', error);
      setError('Network error loading collaboration data');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'chat', label: 'Team Chat', icon: MessageSquare },
    { id: 'notes', label: 'Shared Notes', icon: FileText },
    { id: 'activity', label: 'Activity Feed', icon: Activity }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team collaboration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Team Collaboration</h1>
                <p className="text-sm text-gray-600">Work together seamlessly</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'chat' && (
          <TeamChat 
            channels={channels} 
            user={user}
            onChannelsUpdate={setChannels}
            onError={setError}
          />
        )}
        
        {activeTab === 'notes' && (
          <SharedNotes 
            notes={notes}
            user={user}
            onNotesUpdate={setNotes}
            onError={setError}
          />
        )}
        
        {activeTab === 'activity' && (
          <ActivityFeed 
            activities={activities}
            user={user}
            onRefresh={fetchInitialData}
          />
        )}
      </div>
    </div>
  );
};

export default TeamCollaboration;