import React from 'react';
import { MessageCircle, Users, Lock, Send } from 'lucide-react';

const ChannelList = ({ 
  channels, 
  messages, 
  selectedChannel, 
  onSelectChannel, 
  messageForm, 
  setMessageForm, 
  onSendMessage, 
  loading 
}) => {
  const getChannelIcon = (channelType, isPrivate) => {
    if (isPrivate) return Lock;
    if (channelType === 'project') return Users;
    return MessageCircle;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Safe channel selection handler
  const handleSelectChannel = (channel) => {
    if (channel && channel.id) {
      onSelectChannel(channel);
    } else {
      onSelectChannel(null);
    }
  };

  // Check if message is from current user (you'll need to pass current user info)
  const isOwnMessage = (message) => {
    // You'll need to implement this based on your auth system
    return message.sender_id === 'current-user-id'; // Replace with actual user check
  };

  return (
    <div className="flex flex-col md:flex-row h-full border border-gray-200 rounded-lg">
      {/* Channels Sidebar - Hidden on mobile when channel is selected */}
      <div className={`w-full md:w-1/3 border-r border-gray-200 bg-gray-50 ${
        selectedChannel ? 'hidden md:block' : 'block'
      }`}>
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Channels</h3>
          <p className="text-sm text-gray-600 mt-1">
            {channels.length} channel{channels.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="overflow-y-auto h-[calc(100vh-200px)] md:max-h-[520px]">
          {channels.map((channel) => {
            const Icon = getChannelIcon(channel.channel_type, channel.is_private);
            const isSelected = selectedChannel?.id === channel.id;
            
            return (
              <button
                key={channel.id}
                onClick={() => handleSelectChannel(channel)}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-white transition-colors ${
                  isSelected ? 'bg-white border-blue-200' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium truncate ${
                        isSelected ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {channel.name}
                      </span>
                      {channel.is_private && (
                        <Lock className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {channel.member_count} members
                    </p>
                    {channel.description && (
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {channel.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
          
          {channels.length === 0 && (
            <div className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No channels yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Create a channel to start chatting with your team
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className={`flex-1 flex flex-col ${selectedChannel ? 'block' : 'hidden md:block'}`}>
        {selectedChannel ? (
          <>
            {/* Channel Header with back button for mobile */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleSelectChannel(null)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  {React.createElement(
                    getChannelIcon(selectedChannel.channel_type, selectedChannel.is_private),
                    { className: "w-4 h-4" }
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{selectedChannel.name}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {selectedChannel.member_count} members • {selectedChannel.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages List with WhatsApp-style bubbles */}
            <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-2 bg-gray-50">
              {messages.length > 0 ? (
                messages.map((message) => {
                  const ownMessage = isOwnMessage(message);
                  return (
                    <div key={message.id} className={`flex ${ownMessage ? 'justify-end' : 'justify-start'} px-2`}>
                      <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2 ${
                        ownMessage 
                          ? 'bg-green-500 text-white rounded-br-none' 
                          : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                      }`}>
                        {/* Sender name for others' messages */}
                        {!ownMessage && (
                          <div className="font-semibold text-sm mb-1 text-blue-600">
                            {message.sender_name}
                          </div>
                        )}
                        
                        {/* Message content with proper wrapping */}
                        <div className="break-words whitespace-pre-wrap overflow-wrap-anywhere word-break-break-word">
                          {message.content}
                        </div>
                        
                        {/* Timestamp */}
                        <div className={`text-xs mt-1 ${ownMessage ? 'text-green-100 text-right' : 'text-gray-500 text-right'}`}>
                          {formatTime(message.created_at)}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No messages yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Start the conversation by sending a message
                  </p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-3 md:p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={messageForm.content}
                  onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
                  placeholder={`Message #${selectedChannel.name}`}
                  className="flex-1 border border-gray-300 rounded-full px-4 py-3 md:py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent break-words"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onSendMessage();
                    }
                  }}
                />
                <button
                  onClick={onSendMessage}
                  disabled={loading || !messageForm.content.trim()}
                  className="bg-green-600 text-white p-3 md:px-4 md:py-2 rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden md:inline">Send</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Channel</h3>
              <p className="text-gray-500">Choose a channel from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelList;