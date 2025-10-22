import React, { useState, useEffect } from 'react';
import { MessageSquare, UserPlus, Calendar, Star, AlertTriangle } from 'lucide-react';

const ActivityFeed = ({ interactions, customers }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Generate activity feed from interactions and customer data
    const generatedActivities = [
      ...interactions.slice(0, 10).map(interaction => ({
        id: `interaction-${interaction.id}`,
        type: 'interaction',
        message: `New interaction with customer`,
        customer: customers.find(c => c.id === interaction.customer)?.name || 'Unknown Customer',
        timestamp: new Date(interaction.created_at),
        icon: MessageSquare,
        color: 'blue'
      })),
      ...customers.slice(0, 5).map(customer => ({
        id: `customer-${customer.id}`,
        type: 'new_customer',
        message: 'New customer registered',
        customer: customer.name,
        timestamp: new Date(customer.created_at || new Date()),
        icon: UserPlus,
        color: 'green'
      })),
      // Add some mock activities for demo
      {
        id: 'goal-1',
        type: 'goal',
        message: 'Monthly sales target achieved',
        customer: '',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        icon: Star,
        color: 'yellow'
      },
      {
        id: 'alert-1',
        type: 'alert',
        message: 'High-priority issue reported',
        customer: 'ABC Corporation',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        icon: AlertTriangle,
        color: 'red'
      }
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 15); // Show latest 15 activities

    setActivities(generatedActivities);
  }, [interactions, customers]);

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getActivityColor = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      yellow: 'text-yellow-600 bg-yellow-50',
      red: 'text-red-600 bg-red-50',
      purple: 'text-purple-600 bg-purple-50'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <span className="text-sm text-gray-500">{activities.length} activities</span>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`p-2 rounded-lg ${getActivityColor(activity.color)}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  {activity.message}
                  {activity.customer && (
                    <span className="font-semibold"> {activity.customer}</span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {getTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;