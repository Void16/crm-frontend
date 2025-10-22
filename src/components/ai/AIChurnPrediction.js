// src/components/ai/AIChurnPrediction.js
import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle, Users, TrendingDown } from 'lucide-react';
import { ChurnPredictionService } from '../../ai/services/churnPrediction';

const AIChurnPrediction = ({ customers, interactions }) => {
  const churnData = useMemo(() => {
    if (!customers.length) return null;

    const analyzedCustomers = customers.map(customer => {
      const customerInteractions = interactions.filter(i => i.customer === customer.id);
      const prediction = ChurnPredictionService.predictChurnRisk(customer, customerInteractions);
      
      return {
        ...customer,
        churnRisk: prediction.riskScore,
        riskLevel: prediction.riskLevel,
        riskFactors: prediction.factors
      };
    });

    const highRiskCustomers = analyzedCustomers.filter(c => c.riskLevel === 'high');
    const mediumRiskCustomers = analyzedCustomers.filter(c => c.riskLevel === 'medium');
    const lowRiskCustomers = analyzedCustomers.filter(c => c.riskLevel === 'low');

    const totalRiskScore = analyzedCustomers.reduce((sum, customer) => sum + customer.churnRisk, 0);
    const averageRisk = totalRiskScore / analyzedCustomers.length;

    return {
      highRisk: highRiskCustomers.length,
      mediumRisk: mediumRiskCustomers.length,
      lowRisk: lowRiskCustomers.length,
      averageRisk: Math.round(averageRisk),
      highRiskCustomers: highRiskCustomers.slice(0, 3), // Top 3 high risk
      totalAnalyzed: analyzedCustomers.length
    };
  }, [customers, interactions]);

  if (!churnData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
          Churn Prediction
        </h3>
        <p className="text-gray-500 text-center py-4">No data for churn analysis</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
        Churn Prediction
      </h3>

      {/* Risk Overview */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="text-center p-2 bg-red-50 rounded">
          <div className="text-lg font-bold text-red-600">{churnData.highRisk}</div>
          <div className="text-xs text-red-800">High Risk</div>
        </div>
        <div className="text-center p-2 bg-yellow-50 rounded">
          <div className="text-lg font-bold text-yellow-600">{churnData.mediumRisk}</div>
          <div className="text-xs text-yellow-800">Medium Risk</div>
        </div>
        <div className="text-center p-2 bg-green-50 rounded">
          <div className="text-lg font-bold text-green-600">{churnData.lowRisk}</div>
          <div className="text-xs text-green-800">Low Risk</div>
        </div>
      </div>

      {/* Average Risk */}
      <div className="text-center mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-2xl font-bold text-gray-900">{churnData.averageRisk}%</div>
        <div className="text-sm text-gray-600">Average Churn Risk</div>
      </div>

      {/* High Risk Customers */}
      {churnData.highRisk > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <TrendingDown className="w-4 h-4 mr-1 text-red-600" />
            High Risk Customers
          </h4>
          <div className="space-y-2">
            {churnData.highRiskCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                <span className="text-sm font-medium truncate max-w-[100px]">
                  {customer.name}
                </span>
                <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded">
                  {customer.churnRisk}% risk
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {churnData.highRisk === 0 && (
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-green-800">No high-risk customers detected</p>
        </div>
      )}
    </div>
  );
};

export default AIChurnPrediction;