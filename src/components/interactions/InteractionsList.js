import React from 'react';
import { Calendar, User, Building2, MessageSquare } from 'lucide-react';

const InteractionsList = ({ interactions = [] }) => {
  // Sample data for demonstration
  const sampleInteractions = [
    {
      id: 1,
      customer_name: "Acme Corporation",
      employee_name: "John Smith",
      notes: "Discussed product requirements and timeline for Q4 implementation. Customer showed strong interest in premium features.",
      timestamp: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      customer_name: "TechStart Inc",
      employee_name: "Sarah Johnson",
      notes: "Follow-up call regarding pricing concerns. Provided detailed breakdown of costs.",
      timestamp: "2024-01-14T14:15:00Z"
    },
    {
      id: 3,
      customer_name: "Global Solutions Ltd",
      employee_name: "Mike Davis",
      notes: "Initial consultation meeting. Identified key pain points in their current workflow process.",
      timestamp: "2024-01-13T09:00:00Z"
    }
  ];

  const displayInteractions = interactions.length > 0 ? interactions : sampleInteractions;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Interactions</h2>
        <p className="text-gray-600">Recent customer touchpoints and notes</p>
      </div>

      {/* Mobile-optimized card layout */}
      <div className="space-y-4">
        {displayInteractions.map((interaction) => (
          <div 
            key={interaction.id} 
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            {/* Header section with customer and date */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {interaction.customer_name}
                  </h3>
                </div>
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="text-sm">
                    {new Date(interaction.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Content section */}
            <div className="p-4">
              {/* Employee info */}
              <div className="flex items-center mb-3">
                <User className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">
                  {interaction.employee_name}
                </span>
              </div>

              {/* Notes section */}
              <div className="flex items-start">
                <MessageSquare className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {interaction.notes}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile-specific timestamp */}
            <div className="sm:hidden bg-gray-50 px-4 py-2 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Interaction #{interaction.id}</span>
                <span>
                  {new Date(interaction.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {displayInteractions.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No interactions yet</h3>
          <p className="text-gray-600">Customer interactions will appear here when available.</p>
        </div>
      )}
    </div>
  );
};

export default InteractionsList;