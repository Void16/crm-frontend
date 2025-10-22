// src/components/collaboration/TeamChat.js
import React, { useState, useEffect, useRef } from 'react';
import { Send, Hash, Plus, AtSign, Users } from 'lucide-react';
import { collaborationAPI } from '../../services/api';
import CreateChannelModal from './CreateChannelModal';

const TeamChat = ({ channels, user, onChannelsUpdate, onError }) => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (channels.length > 0 && !selectedChannel) {
      setSelectedChannel(channels[0]);
    }
  }, [channels]);

  useEffect(() => {
    if (selectedChannel) {
      fetchChannelMessages(selectedChannel.id);
      fetchTeamMembers();
    }
  }, [selectedChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChannelMessages = async (channelId) => {
    setLoading(true);
    try {
      const result = await collaborationAPI.getChannelMessages(channelId);
      if (result?.ok) {
        setMessages(result.data);
      } else {
        onError('Failed to load messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      onError('Network error loading messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const result = await collaborationAPI.getTeamMembers();
      if (result?.ok) {
        setTeamMembers(result.data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel) return;

    const messageData = {
      channel: selectedChannel.id,
      content: newMessage.trim()
    };

    setLoading(true);
    try {
      const result = await collaborationAPI.sendMessage(messageData);
      if (result?.ok) {
        setMessages(prev => [...prev, result.data]);
        setNewMessage('');
      } else {
        onError('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      onError('Network error sending message');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const createChannel = async (channelData) => {
    try {
      const result = await collaborationAPI.createChannel(channelData);
      if (result?.ok) {
        onChannelsUpdate(prev => [result.data, ...prev]);
        setSelectedChannel(result.data);
        setShowCreateModal(false);
      } else {
        onError('Failed to create channel');
      }
    } catch (error) {
      console.error('Error creating channel:', error);
      onError('Network error creating channel');
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow border">
      {/* Channels Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Channels</h3>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Create new channel"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {channels.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No channels yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                Create your first channel
              </button>
            </div>
          ) : (
            channels.map(channel => (
              <div
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                className={`flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 ${
                  selectedChannel?.id === channel.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                }`}
              >
                <Hash className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 truncate">
                      {channel.name}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      {channel.member_count}
                    </span>
                  </div>
                  {channel.description && (
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {channel.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChannel ? (
          <>
            {/* Channel Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <Hash className="w-5 h-5 text-gray-500" />
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedChannel.name}</h2>
                  {selectedChannel.description && (
                    <p className="text-sm text-gray-500">{selectedChannel.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading && messages.length === 0 ? (
                <div className="flex justify-center items-center h-20">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                messages.map(message => (
                  <div key={message.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                      {message.sender_name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline space-x-2">
                        <span className="font-semibold text-gray-900">
                          {message.sender_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.created_at).toLocaleTimeString([], { 
                            hour: '2-digit', minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <p className="text-gray-800 mt-1 whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      
                      {/* Mentions */}
                      {message.mentions_data && message.mentions_data.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.mentions_data.map(user => (
                            <span
                              key={user.id}
                              className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                            >
                              <AtSign className="w-3 h-3 mr-1" />
                              {user.first_name} {user.last_name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message #${selectedChannel.name}`}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows="2"
                    disabled={loading}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || loading}
                  className="self-end bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            {channels.length === 0 ? 'Create a channel to start chatting' : 'Select a channel to start messaging'}
          </div>
        )}
      </div>

      {/* Create Channel Modal */}
      <CreateChannelModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={createChannel}
      />
    </div>
  );
};

export default TeamChat;