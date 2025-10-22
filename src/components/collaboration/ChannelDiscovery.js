// src/components/collaboration/ChannelDiscovery.js
import React, { useState, useEffect } from 'react';
import { Search, Users, Lock, Globe, Plus, UserCheck, X, RefreshCw } from 'lucide-react';
import { collaborationAPI } from '../../services/api';

const ChannelDiscovery = ({ onJoinChannel, onClose }) => {
  const [discoverableChannels, setDiscoverableChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [joining, setJoining] = useState({});
  const [error, setError] = useState('');

  const fetchDiscoverableChannels = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    
    try {
      console.log('Fetching discoverable channels...');
      const result = await collaborationAPI.discoverChannels();
      console.log('Discover channels response:', result);
      
      if (result?.ok) {
        setDiscoverableChannels(result.data || []);
        console.log('Available channels:', result.data);
      } else {
        const errorMsg = result?.data?.detail || 'Failed to fetch channels';
        setError(errorMsg);
        console.error('Failed to fetch discoverable channels:', result);
        setDiscoverableChannels([]);
      }
    } catch (error) {
      const errorMsg = error.message || 'Network error fetching channels';
      setError(errorMsg);
      console.error('Error fetching discoverable channels:', error);
      setDiscoverableChannels([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleJoinChannel = async (channelId) => {
    setJoining(prev => ({ ...prev, [channelId]: true }));
    setError('');
    
    try {
      console.log(`Joining channel ${channelId}...`);
      const result = await collaborationAPI.joinChannel(channelId);
      console.log('Join channel response:', result);
      
      if (result?.ok) {
        // Remove the joined channel from the list
        setDiscoverableChannels(prev => 
          prev.filter(channel => channel.id !== channelId)
        );
        
        // Call the callback if provided
        if (onJoinChannel) {
          onJoinChannel(channelId);
        }
        
        // Show success message temporarily
        setError('Successfully joined channel!');
        setTimeout(() => setError(''), 3000);
      } else {
        const errorMsg = result?.data?.detail || result?.data?.error || 'Failed to join channel';
        setError(errorMsg);
        console.error('Failed to join channel:', result);
      }
    } catch (error) {
      const errorMsg = error.message || 'Network error joining channel';
      setError(errorMsg);
      console.error('Error joining channel:', error);
    } finally {
      setJoining(prev => ({ ...prev, [channelId]: false }));
    }
  };

  useEffect(() => {
    fetchDiscoverableChannels();
  }, []);

  const filteredChannels = discoverableChannels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (channel.description && channel.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getChannelIcon = (channelType, isPrivate) => {
    if (isPrivate) return Lock;
    if (channelType === 'project') return Users;
    return Globe;
  };

  const getChannelTypeDisplay = (channelType) => {
    const types = {
      'general': 'General',
      'project': 'Project',
      'department': 'Department',
      'private': 'Private'
    };
    return types[channelType] || channelType;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Discover Channels</h2>
              <p className="text-sm text-gray-600 mt-1">
                Find and join public channels
              </p>
            </div>
            <button
              onClick={() => fetchDiscoverableChannels(true)}
              disabled={refreshing}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              title="Refresh channels"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Error/Success Message */}
        {error && (
          <div className={`mt-3 p-3 rounded-lg text-sm ${
            error.includes('Successfully') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {error}
          </div>
        )}

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search channels by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Channels List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading available channels...</span>
            </div>
          </div>
        ) : filteredChannels.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredChannels.map((channel) => {
              const Icon = getChannelIcon(channel.channel_type, channel.is_private);
              
              return (
                <div key={channel.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg ${
                        channel.is_private 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900 truncate">#{channel.name}</h3>
                          {channel.is_private && (
                            <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {channel.description || 'No description provided'}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{channel.member_count || 0} members</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                              {getChannelTypeDisplay(channel.channel_type)}
                            </span>
                          </div>
                          {channel.created_by_name && (
                            <div className="flex items-center space-x-1">
                              <UserCheck className="w-3 h-3" />
                              <span>By {channel.created_by_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoinChannel(channel.id)}
                      disabled={joining[channel.id] || channel.is_private}
                      className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors flex-shrink-0"
                      title={channel.is_private ? 'Private channel - request invitation' : 'Join channel'}
                    >
                      {joining[channel.id] ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Joining...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Join</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No channels found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {searchTerm 
                ? `No channels match "${searchTerm}". Try a different search term.`
                : 'No public channels available to join. All channels might be private or you are already a member of all public channels.'
              }
            </p>
            <button
              onClick={() => fetchDiscoverableChannels(true)}
              disabled={refreshing}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 mx-auto transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            {filteredChannels.length > 0 
              ? `Showing ${filteredChannels.length} of ${discoverableChannels.length} channels`
              : `${discoverableChannels.length} channels available`
            }
          </span>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelDiscovery;