import React from 'react';
import { Target, TrendingUp, Award } from 'lucide-react';

const GoalTracking = ({ customers, interactions }) => {
  const goals = [
    {
      id: 1,
      title: 'Monthly Customer Acquisition',
      target: 50,
      current: customers.length,
      progress: Math.min((customers.length / 50) * 100, 100),
      color: 'blue',
      icon: Target
    },
    {
      id: 2,
      title: 'Customer Engagement Rate',
      target: 80,
      current: Math.round((customers.filter(c => 
        interactions.some(i => i.customer === c.id)
      ).length / Math.max(customers.length, 1)) * 100),
      progress: Math.min((customers.filter(c => 
        interactions.some(i => i.customer === c.id)
      ).length / Math.max(customers.length, 1)) * 100, 100),
      color: 'green',
      icon: TrendingUp
    },
    {
      id: 3,
      title: 'Revenue Target',
      target: 50000,
      current: customers.reduce((sum, customer) => 
        sum + (customer.total_purchase_value || 0), 0
      ),
      progress: Math.min((customers.reduce((sum, customer) => 
        sum + (customer.total_purchase_value || 0), 0
      ) / 50000) * 100, 100),
      color: 'purple',
      icon: Award
    }
  ];

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      purple: 'text-purple-600 bg-purple-50'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Tracking</h3>
      <div className="space-y-4">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const isCurrency = goal.id === 3;
          
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${getColorClasses(goal.color)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{goal.title}</h4>
                    <p className="text-xs text-gray-500">
                      {isCurrency ? '$' : ''}{goal.current.toLocaleString()} / {isCurrency ? '$' : ''}{goal.target.toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${
                  goal.progress >= 100 ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {Math.round(goal.progress)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(goal.progress)}`}
                  style={{ width: `${Math.min(goal.progress, 100)}%` }}
                ></div>
              </div>
              
              {goal.progress >= 100 && (
                <div className="flex items-center text-xs text-green-600 font-medium">
                  <Award className="w-3 h-3 mr-1" />
                  Goal Achieved! 🎉
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalTracking;