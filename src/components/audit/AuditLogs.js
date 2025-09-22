import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  User, 
  Clock, 
  FileText, 
  Search, 
  Filter, 
  Trash2, 
  Download,
  RefreshCw,
  Eye,
  ChevronDown,
  X
} from 'lucide-react';

const AuditLogs = ({ auditLogs: initialAuditLogs = [], onClearAll, onRefresh }) => {
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs.length ? initialAuditLogs : [
    {
      id: 1,
      employee_name: "John Doe",
      action: "create",
      details: "Created new customer record for Acme Corp",
      timestamp: "2024-09-22T14:30:00Z",
      ip_address: "192.168.1.100"
    },
    {
      id: 2,
      employee_name: "Jane Smith",
      action: "update",
      details: "Updated customer contact information",
      timestamp: "2024-09-22T13:15:00Z",
      ip_address: "192.168.1.101"
    },
    {
      id: 3,
      employee_name: "Mike Johnson",
      action: "delete",
      details: "Deleted archived customer records",
      timestamp: "2024-09-22T12:00:00Z",
      ip_address: "192.168.1.102"
    },
    {
      id: 4,
      employee_name: "Sarah Wilson",
      action: "login",
      details: "User logged into the system",
      timestamp: "2024-09-22T09:00:00Z",
      ip_address: "192.168.1.103"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState(new Set());
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'

  const actions = ['create', 'update', 'delete', 'login', 'logout'];

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesSearch = 
        log.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAction = !actionFilter || log.action === actionFilter;
      
      const matchesDate = !dateFilter || 
        new Date(log.timestamp).toISOString().split('T')[0] === dateFilter;
      
      return matchesSearch && matchesAction && matchesDate;
    });
  }, [auditLogs, searchTerm, actionFilter, dateFilter]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setActionFilter('');
    setDateFilter('');
    setSelectedLogs(new Set());
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all audit logs? This action cannot be undone.')) {
      setAuditLogs([]);
      setSelectedLogs(new Set());
      if (onClearAll) onClearAll();
    }
  };

  const handleClearSelected = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedLogs.size} selected logs?`)) {
      setAuditLogs(prev => prev.filter(log => !selectedLogs.has(log.id)));
      setSelectedLogs(new Set());
    }
  };

  const handleSelectLog = (logId) => {
    setSelectedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedLogs.size === filteredLogs.length) {
      setSelectedLogs(new Set());
    } else {
      setSelectedLogs(new Set(filteredLogs.map(log => log.id)));
    }
  };

  const getActionBadge = (action) => {
    const styles = {
      create: 'bg-green-100 text-green-800 border-green-200',
      update: 'bg-blue-100 text-blue-800 border-blue-200',
      delete: 'bg-red-100 text-red-800 border-red-200',
      login: 'bg-purple-100 text-purple-800 border-purple-200',
      logout: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[action] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {action.charAt(0).toUpperCase() + action.slice(1)}
      </span>
    );
  };

  const LogCard = ({ log }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedLogs.has(log.id)}
            onChange={() => handleSelectLog(log.id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <User className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-gray-900">{log.employee_name}</span>
        </div>
        {getActionBadge(log.action)}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-700 leading-relaxed">{log.details}</p>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{new Date(log.timestamp).toLocaleString()}</span>
          </div>
          {log.ip_address && (
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
              {log.ip_address}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-sm text-gray-600 mt-1">
              Track system activities and user actions
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onRefresh && onRefresh()}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            
            <button
              onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <Eye className="h-4 w-4" />
              <span>{viewMode === 'card' ? 'Table' : 'Cards'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee, action, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <Filter className="h-4 w-4" />
            <span>Advanced Filters</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Type
                </label>
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Actions</option>
                  {actions.map(action => (
                    <option key={action} value={action}>
                      {action.charAt(0).toUpperCase() + action.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearAllFilters}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary and Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Showing {filteredLogs.length} of {auditLogs.length} logs
            </span>
            {selectedLogs.size > 0 && (
              <span className="text-sm text-blue-600 font-medium">
                {selectedLogs.size} selected
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {viewMode === 'card' && filteredLogs.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {selectedLogs.size === filteredLogs.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
            
            {selectedLogs.size > 0 && (
              <button
                onClick={handleClearSelected}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Selected</span>
              </button>
            )}
            
            {auditLogs.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            )}
            
            <button className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Logs Display */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
          <p className="text-gray-500">
            {auditLogs.length === 0 
              ? "No audit logs have been recorded yet." 
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredLogs.map((log) => (
            <LogCard key={log.id} log={log} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedLogs.size === filteredLogs.length && filteredLogs.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedLogs.has(log.id)}
                        onChange={() => handleSelectLog(log.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <div className="text-sm font-medium text-gray-900">
                          {log.employee_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <div className="text-sm text-gray-900">
                          {log.details}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <div className="text-sm text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;