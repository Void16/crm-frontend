import React from 'react';
import LiveMetrics from './LiveMetrics';
import InteractiveCharts from './InteractiveCharts';
import ActivityFeed from './ActivityFeed';
import GoalTracking from './GoalTracking';

const RealTimeDashboard = ({ customers, interactions, loading }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Real-Time Dashboard</h1>
            <p className="text-blue-100 mt-1">
              Live insights and analytics for your CRM data
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Live Data</span>
          </div>
        </div>
      </div>

      {/* Live Metrics */}
      <LiveMetrics 
        customers={customers} 
        interactions={interactions} 
        loading={loading} 
      />

      {/* Charts and Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts - 2/3 width */}
        <div className="lg:col-span-2">
          <InteractiveCharts 
            customers={customers} 
            interactions={interactions} 
          />
        </div>

        {/* Activity and Goals - 1/3 width */}
        <div className="space-y-6">
          <ActivityFeed 
            customers={customers} 
            interactions={interactions} 
          />
          <GoalTracking 
            customers={customers} 
            interactions={interactions} 
          />
        </div>
      </div>
    </div>
  );
};

export default RealTimeDashboard;