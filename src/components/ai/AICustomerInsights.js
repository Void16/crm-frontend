// src/components/ai/AICustomerInsights.js
import React, { useMemo } from 'react';
import { Users, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { SentimentAnalysisService } from '../../ai/services/sentimentAnalysis';

const AICustomerInsights = ({ customers, interactions }) => {
  const insights = useMemo(() => {
    if (!customers.length || !interactions.length) return null;

    // Calculate sentiment trends
    const recentInteractions = interactions.slice(0, 20);
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    recentInteractions.forEach(interaction => {
      if (interaction.sentiment === 'positive') positiveCount++;
      else if (interaction.sentiment === 'negative') negativeCount++;
      else neutralCount++;
    });

    const totalInteractions = recentInteractions.length;
    const positivePercentage = totalInteractions > 0 ? (positiveCount / totalInteractions) * 100 : 0;
    const negativePercentage = totalInteractions > 0 ? (negativeCount / totalInteractions) * 100 : 0;

    // Customer engagement metrics
    const activeCustomers = customers.filter(customer => {
      const customerInteractions = interactions.filter(i => i.customer === customer.id);
      return customerInteractions.length > 0;
    }).length;

    const engagementRate = (activeCustomers / customers.length) * 100;

    return {
      positivePercentage: Math.round(positivePercentage),
      negativePercentage: Math.round(negativePercentage),
      engagementRate: Math.round(engagementRate),
      totalCustomers: customers.length,
      activeCustomers,
      sentimentScore: positivePercentage - negativePercentage
    };
  }, [customers, interactions]);

  if (!insights) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-600" />
          Customer Insights
        </h3>
        <p className="text-gray-500 text-center py-4">No data available for analysis</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-blue-600" />
        Customer Insights
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{insights.positivePercentage}%</div>
          <div className="text-sm text-green-800">Positive Sentiment</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{insights.negativePercentage}%</div>
          <div className="text-sm text-red-800">Negative Sentiment</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Engagement Rate</span>
          <span className="text-sm font-semibold">{insights.engagementRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${insights.engagementRate}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Active Customers</span>
          <span className="font-semibold">
            {insights.activeCustomers} / {insights.totalCustomers}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Sentiment Score</span>
          <span className={`font-semibold ${insights.sentimentScore >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {insights.sentimentScore >= 0 ? '+' : ''}{insights.sentimentScore.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AICustomerInsights;