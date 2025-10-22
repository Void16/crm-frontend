// src/components/collaboration/ActivityFeed.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  User, 
  MessageSquare, 
  FileText, 
  Users, 
  Calendar,
  RefreshCw,
  Filter,
  Search,
  MoreVertical,
  Eye,
  ExternalLink,
  Clock,
  Building2,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Zap,
  Heart,
  ThumbsUp,
  Star,
  Download,
  Share2
} from 'lucide-react';

const ActivityFeed = ({ 
  activities = [], 
  user, 
  onRefresh,
  onActivityClick,
  isLoading = false,
  showFilters = true 
}) => {
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [activityFilter, setActivityFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedActivity, setExpandedActivity] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const feedRef = useRef(null);

  // Enhanced sample activities with more realistic data
  const sampleActivities = [
    {
      id: 1,
      activity_type: 'message',
      user_id: 2,
      user_name: 'Sarah Johnson',
      user_avatar: 'SJ',
      user_role: 'Account Manager',
      content: 'Just had a great call with Acme Corp. They\'re very interested in our enterprise package and want to schedule a technical demo next week.',
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      channel_name: 'enterprise-sales',
      customer_name: 'Acme Corporation',
      priority: 'high',
      metadata: {
        message_length: 120,
        reactions: 3,
        replies: 2
      }
    },
    {
      id: 2,
      activity_type: 'customer_created',
      user_id: 1,
      user_name: 'Mike Davis',
      user_avatar: 'MD',
      user_role: 'Sales Executive',
      content: 'Added new enterprise client to the system with initial contact information and requirements.',
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      customer_name: 'TechStart Inc',
      customer_id: 'CUST-2024-001',
      metadata: {
        company_size: '50-100',
        industry: 'SaaS'
      }
    },
    {
      id: 3,
      activity_type: 'note_created',
      user_id: 3,
      user_name: 'Lisa Wong',
      user_avatar: 'LW',
      user_role: 'Customer Success',
      content: 'Documented detailed requirements from the client meeting including specific integration needs and timeline expectations for Q2 implementation.',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      customer_name: 'Global Solutions Ltd',
      metadata: {
        note_type: 'meeting_notes',
        attachments: 2
      }
    },
    {
      id: 4,
      activity_type: 'issue_created',
      user_id: 4,
      user_name: 'David Kim',
      user_avatar: 'DK',
      user_role: 'Support Technician',
      content: 'Reported critical meter reading issue for downtown district. Multiple customers affected. Emergency response team dispatched.',
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      issue_id: 'ISS-2024-045',
      priority: 'critical',
      metadata: {
        affected_customers: 15,
        estimated_resolution: '4-6 hours'
      }
    },
    {
      id: 5,
      activity_type: 'interaction_created',
      user_id: 1,
      user_name: 'Mike Davis',
      user_avatar: 'MD',
      user_role: 'Sales Executive',
      content: 'Recorded detailed customer interaction regarding pricing negotiation and contract terms for the upcoming quarter.',
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      customer_name: 'Innovation Labs',
      metadata: {
        duration: '45 minutes',
        satisfaction_rating: 5
      }
    },
    {
      id: 6,
      activity_type: 'customer_updated',
      user_id: 2,
      user_name: 'Sarah Johnson',
      user_avatar: 'SJ',
      user_role: 'Account Manager',
      content: 'Updated customer contact information and added new technical requirements from the engineering team.',
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      customer_name: 'Data Dynamics',
      metadata: {
        updated_fields: ['contact_info', 'requirements'],
        version: 'v2.1'
      }
    },
    {
      id: 7,
      activity_type: 'message',
      user_id: 3,
      user_name: 'Lisa Wong',
      user_avatar: 'LW',
      user_role: 'Customer Success',
      content: 'Shared the quarterly performance report with the client. They were very pleased with the results and discussed expansion opportunities.',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      channel_name: 'client-success',
      customer_name: 'Enterprise Solutions',
      metadata: {
        message_length: 95,
        attachments: 1,
        reactions: 5
      }
    }
  ];

  const displayActivities = activities.length > 0 ? activities : sampleActivities;

  // Filter and sort activities
  useEffect(() => {
    let filtered = displayActivities;

    // Activity type filter
    if (activityFilter !== 'all') {
      filtered = filtered.filter(activity => activity.activity_type === activityFilter);
    }

    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (timeFilter) {
        case 'today':
          filtered = filtered.filter(activity => 
            new Date(activity.created_at).toDateString() === now.toDateString()
          );
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(activity => 
            new Date(activity.created_at) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(activity => 
            new Date(activity.created_at) >= filterDate
          );
          break;
        default:
          break;
      }
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.channel_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by most recent
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setFilteredActivities(filtered);
  }, [displayActivities, activityFilter, timeFilter, searchTerm]);

  const getActivityIcon = (activityType) => {
    switch (activityType) {
      case 'message':
        return MessageSquare;
      case 'note_created':
        return FileText;
      case 'note_updated':
        return FileText;
      case 'customer_created':
        return Users;
      case 'customer_updated':
        return Users;
      case 'issue_created':
        return AlertCircle;
      case 'issue_updated':
        return CheckCircle;
      case 'interaction_created':
        return TrendingUp;
      default:
        return Activity;
    }
  };

  const getActivityColor = (activityType, priority) => {
    if (priority === 'critical') return 'text-red-600 bg-red-50 border-red-200';
    if (priority === 'high') return 'text-orange-600 bg-orange-50 border-orange-200';
    
    switch (activityType) {
      case 'message':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'note_created':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'note_updated':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'customer_created':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'customer_updated':
        return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'issue_created':
      case 'issue_updated':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'interaction_created':
        return 'text-teal-600 bg-teal-50 border-teal-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getActivityPriority = (priority) => {
    switch (priority) {
      case 'critical':
        return { label: 'Critical', color: 'bg-red-100 text-red-800 border-red-200' };
      case 'high':
        return { label: 'High', color: 'bg-orange-100 text-orange-800 border-orange-200' };
      case 'medium':
        return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
      case 'low':
        return { label: 'Low', color: 'bg-green-100 text-green-800 border-green-200' };
      default:
        return null;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return activityTime.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const getActivityDescription = (activity) => {
    const baseDescriptions = {
      'message': 'sent a message',
      'note_created': 'created a note',
      'note_updated': 'updated a note',
      'customer_created': 'added a new customer',
      'customer_updated': 'updated customer information',
      'issue_created': 'reported a new issue',
      'issue_updated': 'updated an issue',
      'interaction_created': 'recorded a customer interaction'
    };

    return baseDescriptions[activity.activity_type] || 'performed an action';
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const toggleExpand = (activityId) => {
    setExpandedActivity(expandedActivity === activityId ? null : activityId);
  };

  const getAvatarColor = (userId) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 
      'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500'
    ];
    return colors[userId % colors.length];
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="animate-pulse flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Team Activity Feed
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Real-time updates from your team
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Activities</option>
              <option value="message">Messages</option>
              <option value="note_created">Notes</option>
              <option value="customer_created">New Customers</option>
              <option value="customer_updated">Customer Updates</option>
              <option value="issue_created">Issues</option>
              <option value="interaction_created">Interactions</option>
            </select>

            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            <div className="text-xs text-gray-500 flex items-center justify-end">
              <Clock className="w-3 h-3 mr-1" />
              {filteredActivities.length} activities
            </div>
          </div>
        )}
      </div>

      {/* Activities List */}
      <div 
        ref={feedRef}
        className="divide-y divide-gray-100 max-h-[calc(100vh-400px)] overflow-y-auto"
      >
        {filteredActivities.map((activity) => {
          const Icon = getActivityIcon(activity.activity_type);
          const isCurrentUser = user && activity.user_id === user.id;
          const priorityInfo = getActivityPriority(activity.priority);
          const isExpanded = expandedActivity === activity.id;

          return (
            <div 
              key={activity.id} 
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
              onClick={() => onActivityClick?.(activity)}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(activity.user_id)}`}>
                    {activity.user_avatar || activity.user_name?.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold text-sm ${isCurrentUser ? 'text-blue-600' : 'text-gray-900'}`}>
                        {activity.user_name}
                        {isCurrentUser && ' (You)'}
                      </span>
                      
                      {activity.user_role && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {activity.user_role}
                        </span>
                      )}

                      <span className="text-xs text-gray-400">•</span>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatTime(activity.created_at)}
                      </div>

                      {priorityInfo && (
                        <span className={`text-xs px-2 py-1 rounded-full border ${priorityInfo.color}`}>
                          {priorityInfo.label}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(activity.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Activity Description */}
                  <div className="flex items-start gap-2 mb-3">
                    <div className={`p-2 rounded-lg border ${getActivityColor(activity.activity_type, activity.priority)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-gray-700 text-sm">
                        {getActivityDescription(activity)}
                        {activity.channel_name && (
                          <span className="text-blue-600 font-medium"> in {activity.channel_name}</span>
                        )}
                      </p>
                      
                      {/* Activity Content */}
                      {activity.content && (
                        <div className="mt-2">
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {activity.content}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metadata and Tags */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {activity.customer_name && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Building2 className="w-3 h-3" />
                        {activity.customer_name}
                      </div>
                    )}
                    
                    {activity.issue_id && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <AlertCircle className="w-3 h-3" />
                        Issue #{activity.issue_id}
                      </div>
                    )}

                    {activity.customer_id && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <Users className="w-3 h-3" />
                        {activity.customer_id}
                      </div>
                    )}

                    {/* Additional Metadata */}
                    {activity.metadata && (
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {activity.metadata.reactions > 0 && (
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            {activity.metadata.reactions}
                          </div>
                        )}
                        
                        {activity.metadata.replies > 0 && (
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {activity.metadata.replies}
                          </div>
                        )}
                        
                        {activity.metadata.attachments > 0 && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {activity.metadata.attachments}
                          </div>
                        )}
                        
                        {activity.metadata.satisfaction_rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            {activity.metadata.satisfaction_rating}/5
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && activity.metadata && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        {Object.entries(activity.metadata).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                            <span className="text-gray-900 font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <div className="p-12 text-center">
          <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || activityFilter !== 'all' || timeFilter !== 'all'
              ? 'No matching activities found'
              : 'No Activity Yet'
            }
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchTerm || activityFilter !== 'all' || timeFilter !== 'all'
              ? 'Try adjusting your search criteria or filters to see more results.'
              : 'Team activity will appear here as people start collaborating and updating customer information.'
            }
          </p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Check for New Activity
          </button>
        </div>
      )}

      {/* Footer */}
      {filteredActivities.length > 0 && (
        <div className="p-4 border-t border-gray-200 text-center bg-gray-50">
          <button
            onClick={handleRefresh}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Load more activities'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;