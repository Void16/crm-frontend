import React from 'react';
import { BarChart3, AlertTriangle } from 'lucide-react';

const PerformanceMetrics = ({ performanceData, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading performance metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold">Project Officers Performance</h3>
      </div>

      {performanceData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {performanceData.map((officer, index) => {
            const resolutionRate =
              officer.reported_issues > 0
                ? Math.round((officer.resolved_issues / officer.reported_issues) * 100)
                : 0;

            return (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3">{officer.officer_name}</h4>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Reported Issues:</span>
                    <span className="font-semibold">{officer.reported_issues}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Resolved Issues:</span>
                    <span className="font-semibold text-green-600">{officer.resolved_issues}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Resolution Rate:</span>
                    <span className="font-semibold">{resolutionRate}%</span>
                  </div>

                  {officer.avg_resolution_time && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg. Resolution:</span>
                      <span className="font-semibold text-blue-600">
                        {formatDuration(officer.avg_resolution_time)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No performance data available</p>
          <p className="text-sm text-gray-400 mt-1">
            Performance metrics will appear once project officers start reporting issues
          </p>
        </div>
      )}
    </div>
  );
};

// Helper to format resolution time nicely
function formatDuration(duration) {
  if (typeof duration !== "string") return duration;

  let result = "";

  // Check if there's a "day" part
  const dayMatch = duration.match(/(\d+)\sday/);
  if (dayMatch) {
    result += `${dayMatch[1]}d `;
  }

  // Extract hours, minutes, seconds from "HH:MM:SS"
  const timeMatch = duration.match(/(\d+):(\d+):(\d+)/);
  if (timeMatch) {
    const hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);

    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;
  }

  return result.trim() || duration;
}

export default PerformanceMetrics;
