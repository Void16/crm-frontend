// src/components/ai/AIDashboard.js
import React from 'react';
import AICustomerInsights from './AICustomerInsights';
import AILeadScoring from './AILeadScoring';
import AIChurnPrediction from './AIChurnPrediction';
import AIRecommendationsPanel from './AIRecommendationsPanel';

const AIDashboard = ({ customers, interactions, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm">Loading AI Insights...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">AI Customer Insights</h2>
            <p className="text-blue-100 mt-1">
              Powered by machine learning to help you make data-driven decisions
            </p>
          </div>
          <div className="bg-white/20 rounded-full p-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* AI Components Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <AICustomerInsights customers={customers} interactions={interactions} />
          <AILeadScoring customers={customers} interactions={interactions} />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <AIChurnPrediction customers={customers} interactions={interactions} />
          <AIRecommendationsPanel customers={customers} interactions={interactions} />
        </div>
      </div>
    </div>
  );
};

export default AIDashboard;