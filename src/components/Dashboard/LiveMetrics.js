import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, MessageSquare, DollarSign, Target } from 'lucide-react';

const LiveMetrics = ({ customers, interactions, loading }) => {
  const [metrics, setMetrics] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    totalInteractions: 0,
    conversionRate: 0,
    revenue: 0
  });

  useEffect(() => {
    if (customers.length > 0 || interactions.length > 0) {
      const totalCustomers = customers.length;
      const activeCustomers = customers.filter(c => 
        interactions.some(i => i.customer === c.id)
      ).length;
      
      const totalInteractions = interactions.length;
      const conversionRate = totalCustomers > 0 ? (activeCustomers / totalCustomers) * 100 : 0;
      
      // Mock revenue calculation - replace with actual data
      const revenue = customers.reduce((sum, customer) => 
        sum + (customer.total_purchase_value || 0), 0
      );

      setMetrics({
        totalCustomers,
        activeCustomers,
        totalInteractions,
        conversionRate: Math.round(conversionRate),
        revenue
      });
    }
  }, [customers, interactions]);

  const metricCards = [
    {
      title: 'Total Customers',
      value: metrics.totalCustomers,
      icon: Users,
      color: 'blue',
      change: '+12%'
    },
    {
      title: 'Active Customers',
      value: metrics.activeCustomers,
      icon: TrendingUp,
      color: 'green',
      change: '+8%'
    },
    {
      title: 'Interactions',
      value: metrics.totalInteractions,
      icon: MessageSquare,
      color: 'purple',
      change: '+15%'
    },
    {
      title: 'Conversion Rate',
      value: `${metrics.conversionRate}%`,
      icon: Target,
      color: 'orange',
      change: '+5%'
    },
    {
      title: 'Revenue',
      value: `$${metrics.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
      change: '+18%'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {metricCards.map((metric, index) => {
        const Icon = metric.icon;
        const colorClasses = {
          blue: 'text-blue-600 bg-blue-50',
          green: 'text-green-600 bg-green-50',
          purple: 'text-purple-600 bg-purple-50',
          orange: 'text-orange-600 bg-orange-50'
        };

        return (
          <div key={index} className="bg-white rounded-lg shadow border p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <p className="text-xs text-green-600 font-medium mt-1">{metric.change}</p>
              </div>
              <div className={`p-2 rounded-lg ${colorClasses[metric.color]}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LiveMetrics;