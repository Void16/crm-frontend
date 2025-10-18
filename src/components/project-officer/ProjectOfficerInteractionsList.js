import React from 'react';
import { MapPin, Calendar, User, MessageCircle, Phone, Mail, Users, Wrench, Settings } from 'lucide-react';

const ProjectOfficerInteractionsList = ({ interactions }) => {
  const getInteractionIcon = (type) => {
    const icons = {
      site_visit: <MapPin className="h-4 w-4" />,
      phone_call: <Phone className="h-4 w-4" />,
      email: <Mail className="h-4 w-4" />,
      meeting: <Users className="h-4 w-4" />,
      maintenance_check: <Wrench className="h-4 w-4" />,
      customer_support: <Settings className="h-4 w-4" />, // Changed from Tool to Settings
    };
    return icons[type] || <MessageCircle className="h-4 w-4" />;
  };

  const getInteractionTypeLabel = (type) => {
    const labels = {
      site_visit: 'Site Visit',
      phone_call: 'Phone Call',
      email: 'Email',
      meeting: 'Meeting',
      maintenance_check: 'Maintenance Check',
      customer_support: 'Customer Support',
    };
    return labels[type] || type;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {interactions.map((interaction) => (
        <div key={interaction.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            {/* Left Section - Interaction Details */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2">
                  {getInteractionIcon(interaction.interaction_type)}
                  <span className="font-medium text-gray-900">
                    {getInteractionTypeLabel(interaction.interaction_type)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {formatDate(interaction.interaction_date)}
                  </span>
                </div>
              </div>

              {/* Customer and Location */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-900">
                    {interaction.customer_name}
                  </span>
                </div>
                {interaction.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>{interaction.location}</span>
                  </div>
                )}
                {interaction.assigned_area && (
                  <div className="text-xs text-blue-600 mt-1">
                    Area: {interaction.assigned_area}
                  </div>
                )}
              </div>

              {/* Notes */}
              {interaction.notes && (
                <div className="flex items-start gap-2">
                  <MessageCircle className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {interaction.notes}
                  </p>
                </div>
              )}

              {/* Follow Up Information */}
              {interaction.follow_up_required && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-yellow-800">
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium">Follow-up required</span>
                    {interaction.follow_up_date && (
                      <span className="text-yellow-600">
                        • Due: {new Date(interaction.follow_up_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Section - Metadata */}
            <div className="sm:text-right text-sm text-gray-600">
              <div className="mb-1">
                <span className="font-medium">Recorded by:</span>
                <div>{interaction.officer_name}</div>
              </div>
              <div>
                <span className="font-medium">Created:</span>
                <div>{formatDate(interaction.created_at)}</div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {interactions.length === 0 && (
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No field interactions recorded</p>
          <p className="text-sm text-gray-400 mt-1">
            Start recording your customer interactions and site visits
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectOfficerInteractionsList;