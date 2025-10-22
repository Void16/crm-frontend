// src/components/ai/AIRecommendationsPanel.js
import React, { useMemo } from 'react';
import { Lightbulb, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { RecommendationEngine } from '../../ai/services/recommendationEngine';

const AIRecommendationsPanel = ({ customers, interactions }) => {
  const recommendations = useMemo(() => {
    if (!customers.length || !interactions.length) return [];

    const allRecommendations = [];
    
    customers.forEach(customer => {
      const customerInteractions = interactions.filter(i => i.customer === customer.id);
      const customerRecs = RecommendationEngine.getInteractionRecommendations(customer, customerInteractions);
      
      customerRecs.forEach(rec => {
        allRecommendations.push({
          ...rec,
          customerName: customer.name,
          customerId: customer.id
        });
      });
    });

    // Sort by priority and return top 5
    return allRecommendations
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 5);
  }, [customers, interactions]);

  const getIcon = (type) => {
    switch (type) {
      case 'urgent': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'support': return <Clock className="w-4 h-4 text-orange-600" />;
      case 'engagement': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'upsell': return <Lightbulb className="w-4 h-4 text-green-600" />;
      default: return <Lightbulb className="w-4 h-4 text-gray-600" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'urgent': return 'bg-red-50 border-red-200';
      case 'support': return 'bg-orange-50 border-orange-200';
      case 'engagement': return 'bg-blue-50 border-blue-200';
      case 'upsell': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
          AI Recommendations
        </h3>
        <p className="text-gray-500 text-center py-4">No recommendations at this time</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
        AI Recommendations
      </h3>

      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg border ${getBgColor(rec.type)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                {getIcon(rec.type)}
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {rec.customerName}
                </span>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                rec.type === 'urgent' ? 'bg-red-100 text-red-800' :
                rec.type === 'support' ? 'bg-orange-100 text-orange-800' :
                rec.type === 'engagement' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {rec.type}
              </span>
            </div>
            
            <p className="text-sm text-gray-700 mb-2">{rec.message}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{rec.action}</span>
              {rec.priority === 1 && (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">URGENT</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendationsPanel;