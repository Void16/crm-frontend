import React from 'react';
import { MapPin, Calendar, User, MessageCircle, Phone, Mail, Users, Wrench, Settings, RefreshCw } from 'lucide-react';

const AdminInteractionsList = ({ interactions, loading, onRefresh }) => {
  const getInteractionIcon = (type) => {
    const icons = {
      site_visit: <MapPin className="h-4 w-4" />,
      phone_call: <Phone className="h-4 w-4" />,
      email: <Mail className="h-4 w-4" />,
      meeting: <Users className="h-4 w-4" />,
      maintenance_check: <Wrench className="h-4 w-4" />,
      customer_support: <Settings className="h-4 w-4" />,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading interactions...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Field Interactions</h3>
          <p className="text-sm text-gray-600 mt-1">
            {interactions.length} interaction{interactions.length !== 1 ? 's' : ''} recorded
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Summary */}
      {interactions.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{interactions.length}</div>
            <div className="text-sm text-blue-800">Total</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {interactions.filter(i => i.interaction_type === 'site_visit').length}
            </div>
            <div className="text-sm text-green-800">Site Visits</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">
              {interactions.filter(i => i.follow_up_required).length}
            </div>
            <div className="text-sm text-purple-800">Need Follow-up</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">
              {new Set(interactions.map(i => i.officer_name)).size}
            </div>
            <div className="text-sm text-orange-800">Active Officers</div>
          </div>
        </div>
      )}

      {/* Interactions List */}
      <div className="space-y-4">
        {interactions.length > 0 ? (
          interactions.map((interaction) => (
            <div key={interaction.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3">
                {/* Left Section - Interaction Details */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
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
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {interaction.officer_name}
                      </span>
                    </div>
                  </div>

                  {/* Customer and Location */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-lg">
                        {interaction.customer_name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {interaction.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{interaction.location}</span>
                        </div>
                      )}
                      {interaction.assigned_area && (
                        <div className="flex items-center gap-1">
                          <span className="text-blue-600 font-medium">Area: {interaction.assigned_area}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {interaction.notes && (
                    <div className="flex items-start gap-2">
                      <MessageCircle className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700 leading-relaxed">
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
                <div className="lg:text-right text-sm text-gray-600 space-y-1">
                  <div>
                    <span className="font-medium">Officer:</span>
                    <div className="text-blue-600">{interaction.officer_name}</div>
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>
                    <div className="capitalize">{interaction.interaction_type.replace('_', ' ')}</div>
                  </div>
                  <div>
                    <span className="font-medium">Recorded:</span>
                    <div>{formatDate(interaction.created_at)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No field interactions recorded</p>
            <p className="text-gray-400 text-sm mt-1">
              Project officers will appear here once they start recording interactions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInteractionsList;