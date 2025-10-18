import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Wrench,
  MapPin,
  FileText,
  Calendar,
  RefreshCw 
} from 'lucide-react';

const AdminMeterIssues = ({ meterIssues, loading, onRefresh }) => {
  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case 'resolved':
        return { 
          icon: <CheckCircle className="h-4 w-4" />, 
          color: 'bg-green-100 text-green-800',
          label: 'Resolved'
        };
      case 'in_progress':
        return { 
          icon: <Wrench className="h-4 w-4" />, 
          color: 'bg-blue-100 text-blue-800',
          label: 'In Progress'
        };
      case 'escalated':
        return { 
          icon: <AlertTriangle className="h-4 w-4" />, 
          color: 'bg-orange-100 text-orange-800',
          label: 'Escalated'
        };
      default:
        return { 
          icon: <Clock className="h-4 w-4" />, 
          color: 'bg-gray-100 text-gray-800',
          label: 'Pending'
        };
    }
  };

  // Helper function to get severity color
  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[severity] || colors.medium;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">All Meter Issues</h3>
          <p className="text-sm text-gray-600 mt-1">
            Total issues: {meterIssues.length} • {
              meterIssues.filter(issue => issue.status === 'resolved').length
            } resolved
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
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading issues...</span>
        </div>
      ) : meterIssues.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meter ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer & Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reported By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {meterIssues.map((issue) => {
                const statusInfo = getStatusInfo(issue.status);
                
                return (
                  <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                    {/* Meter ID */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {issue.meter_id}
                      </div>
                    </td>

                    {/* Customer & Location */}
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {issue.customer_name}
                      </div>
                      {issue.customer_location && (
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate max-w-xs">{issue.customer_location}</span>
                        </div>
                      )}
                    </td>

                    {/* Issue Details */}
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {issue.issue_type}
                      </div>
                      {issue.description && (
                        <div className="mt-1">
                          <div className="flex items-start text-sm text-gray-600">
                            <FileText className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{issue.description}</span>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Severity */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(issue.severity_level)}`}>
                        {issue.severity_level}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {statusInfo.icon}
                        <span className={`ml-1.5 px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      {issue.assigned_technician_name && (
                        <div className="text-xs text-gray-500 mt-1">
                          Tech: {issue.assigned_technician_name}
                        </div>
                      )}
                    </td>

                    {/* Timeline */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        {formatDate(issue.reported_at)}
                      </div>
                      {issue.resolved_at && (
                        <div className="text-xs text-green-600 mt-1">
                          Resolved: {formatDate(issue.resolved_at)}
                        </div>
                      )}
                      {issue.last_updated && issue.last_updated !== issue.reported_at && (
                        <div className="text-xs text-blue-600 mt-1">
                          Updated: {formatDate(issue.last_updated)}
                        </div>
                      )}
                    </td>

                    {/* Reported By */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {issue.reported_by_name || 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-3">
            <AlertTriangle className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-500 text-lg font-medium">No meter issues found</p>
          <p className="text-gray-400 text-sm mt-1">All issues are currently resolved</p>
        </div>
      )}
    </div>
  );
};

export default AdminMeterIssues;