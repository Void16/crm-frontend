import React from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  User
} from 'lucide-react';

const MeterIssuesList = ({ issues, onUpdateStatus, /* onAssignTechnician, */ onSubmitFeedback }) => {

  const getStatusIcon = (status) => {
    const icons = {
      resolved: <CheckCircle className="h-4 w-4 text-green-600" />,
      in_progress: <Wrench className="h-4 w-4 text-blue-600" />,
      escalated: <AlertTriangle className="h-4 w-4 text-orange-600" />,
      default: <Clock className="h-4 w-4 text-gray-600" />
    };
    return icons[status] || icons.default;
  };

  const getStatusColor = (status) => {
    const colors = {
      resolved: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      escalated: 'bg-orange-100 text-orange-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.default;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[severity] || colors.low;
  };

  return (
    <div className="space-y-4">
      {issues?.length > 0 ? (
        issues.map((issue) => (
          <div key={issue.id} className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              
              {/* ==== LEFT INFO SECTION ==== */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <h3 className="font-semibold text-lg text-gray-800">{issue.meter_id}</h3>

                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity_level)}`}>
                    {issue.severity_level}
                  </span>

                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                    {getStatusIcon(issue.status)}
                    <span>{issue.status?.replace('_', ' ') || 'Unknown'}</span>
                  </span>
                </div>

                {/* ==== INFO GRID ==== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <span>{issue.customer_name}</span>
                  </div>
                  <div><strong>Location:</strong> {issue.customer_location}</div>
                  <div><strong>Issue:</strong> {issue.issue_type}</div>
                  <div><strong>Reported:</strong> {new Date(issue.reported_at).toLocaleString()}</div>
                  {issue.resolved_at && (
                    <div><strong>Resolved:</strong> {new Date(issue.resolved_at).toLocaleString()}</div>
                  )}
                </div>

                {/* ==== DESCRIPTION ==== */}
                {issue.description && (
                  <div className="mt-3">
                    <strong>Description:</strong>
                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">{issue.description}</p>
                  </div>
                )}

                {/* ==== TECHNICIAN INFO ==== */}
                {issue.assigned_technician_name && (
                  <div className="mt-2 text-sm">
                    <strong>Assigned Technician:</strong> {issue.assigned_technician_name}
                  </div>
                )}
              </div>

              {/* ==== ACTION BUTTONS ==== */}
              <div className="flex flex-wrap gap-2 lg:justify-end">
                {issue.status !== 'resolved' && (
                  <>
                    <button
                      onClick={() => onUpdateStatus(issue.id, 'in_progress', 'Issue in progress')}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
                    >
                      Start Work
                    </button>

                    {/* Temporarily disabled Assign Tech */}
                    {/*
                    <button
                      onClick={() => onAssignTechnician(issue)}
                      className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition"
                    >
                      Assign Tech
                    </button>
                    */}

                    <button
                      onClick={() => onUpdateStatus(issue.id, 'resolved', 'Issue resolved')}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition"
                    >
                      Mark Resolved
                    </button>
                  </>
                )}

                {issue.status === 'resolved' && !issue.customer_feedback && (
                  <button
                    onClick={() => onSubmitFeedback(issue)}
                    className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition"
                  >
                    Add Feedback
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 text-sm">No meter issues found.</p>
        </div>
      )}
    </div>
  );
};

export default MeterIssuesList;
