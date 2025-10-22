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

  return (
    <div className="flex h-[600px] border border-gray-200 rounded-lg">
      {/* Channels Sidebar */}
      <div className="w-1/3 border-r border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Channels</h3>
          <p className="text-sm text-gray-600 mt-1">
            {channels.length} channel{channels.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="overflow-y-auto max-h-[520px]">
          {channels.map((channel) => {
            const Icon = getChannelIcon(channel.channel_type, channel.is_private);
            const isSelected = selectedChannel?.id === channel.id;
            
            return (
              <button
                key={channel.id}
                onClick={() => onSelectChannel(channel)}
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
      <div className="flex-1 flex flex-col">
        {selectedChannel ? (
          <>
            {/* Channel Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  {React.createElement(
                    getChannelIcon(selectedChannel.channel_type, selectedChannel.is_private),
                    { className: "w-4 h-4" }
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedChannel.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedChannel.member_count} members • {selectedChannel.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div key={message.id} className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-semibold">
                          {message.sender_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-gray-900">
                            {message.sender_name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(message.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
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
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={messageForm.content}
                  onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
                  placeholder={`Message #${selectedChannel.name}`}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
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