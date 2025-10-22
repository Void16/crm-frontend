// src/components/ai/AILeadScoring.js
import React, { useMemo } from 'react';
import { Target, Star, TrendingUp, Users } from 'lucide-react';
import { LeadScoringService } from '../../ai/services/leadScoring';

const AILeadScoring = ({ customers, interactions }) => {
  const leadData = useMemo(() => {
    if (!customers.length) return null;

    const scoredCustomers = customers.map(customer => {
      const customerInteractions = interactions.filter(i => i.customer === customer.id);
      const score = LeadScoringService.calculateLeadScore(customer, customerInteractions);
      const grade = LeadScoringService.getLeadGrade(score);
      
      return {
        ...customer,
        leadScore: score,
        leadGrade: grade
      };
    });

    // Sort by score (highest first)
    const sortedCustomers = scoredCustomers.sort((a, b) => b.leadScore - a.leadScore);
    
    // Get top leads
    const topLeads = sortedCustomers.slice(0, 5);
    
    // Calculate distribution
    const distribution = {
      hot: sortedCustomers.filter(c => c.leadScore >= 85).length,
      warm: sortedCustomers.filter(c => c.leadScore >= 70 && c.leadScore < 85).length,
      cool: sortedCustomers.filter(c => c.leadScore >= 50 && c.leadScore < 70).length,
      cold: sortedCustomers.filter(c => c.leadScore < 50).length
    };

    const averageScore = sortedCustomers.reduce((sum, customer) => sum + customer.leadScore, 0) / sortedCustomers.length;

    return {
      topLeads,
      distribution,
      averageScore: Math.round(averageScore),
      totalScored: sortedCustomers.length
    };
  }, [customers, interactions]);

  if (!leadData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-purple-600" />
          Lead Scoring
        </h3>
        <p className="text-gray-500 text-center py-4">No customer data for lead scoring</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Target className="w-5 h-5 mr-2 text-purple-600" />
        Lead Scoring
      </h3>

      {/* Average Score */}
      <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-3xl font-bold text-gray-900">{leadData.averageScore}</div>
        <div className="text-sm text-gray-600">Average Lead Score</div>
      </div>

      {/* Lead Distribution */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Lead Distribution</h4>
        <div className="space-y-2">
          {[
            { label: 'Hot Leads', count: leadData.distribution.hot, color: 'bg-green-500' },
            { label: 'Warm Leads', count: leadData.distribution.warm, color: 'bg-blue-500' },
            { label: 'Cool Leads', count: leadData.distribution.cool, color: 'bg-yellow-500' },
            { label: 'Cold Leads', count: leadData.distribution.cold, color: 'bg-gray-500' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
              <span className="text-sm font-semibold">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Leads */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Top 5 Leads</h4>
        <div className="space-y-2">
          {leadData.topLeads.map((customer, index) => (
            <div key={customer.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${customer.leadGrade.color} mr-2`}></div>
                <span className="text-sm font-medium truncate max-w-[120px]">
                  {customer.name}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded">
                  {customer.leadScore}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AILeadScoring;