import React, { useState } from 'react';
import { User, Mail, Shield, UserCheck, UserX, Trash2, Edit3, MoreVertical } from 'lucide-react';

const EmployeesList = ({ employees, onResetPassword, onDeleteEmployee, onEditEmployee }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleResetPassword = (employeeId) => {
    const newPassword = prompt('Enter new password for this employee:');
    if (newPassword && newPassword.trim() !== '') {
      onResetPassword(employeeId, newPassword);
    }
    setActiveDropdown(null);
  };

  const handleDeleteEmployee = (employeeId, employeeName) => {
    if (window.confirm(`Are you sure you want to delete ${employeeName}? This action cannot be undone.`)) {
      setDeletingId(employeeId);
      onDeleteEmployee(employeeId);
    }
    setActiveDropdown(null);
  };

  const toggleDropdown = (employeeId) => {
    setActiveDropdown(activeDropdown === employeeId ? null : employeeId);
  };

  return (
    <>
      {/* Mobile Card View */}
      <div className="sm:hidden space-y-4">
        {employees.map((employee) => (
          <div key={employee.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Card Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {employee.first_name} {employee.last_name}
                    </h3>
                    <p className="text-xs text-gray-500">@{employee.username}</p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(employee.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  
                  {/* Mobile Actions Dropdown */}
                  {activeDropdown === employee.id && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setActiveDropdown(null)}
                      />
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                        <div className="py-1">
                          <button
                            onClick={() => handleResetPassword(employee.id)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Reset Password
                          </button>
                          {onEditEmployee && (
                            <button
                              onClick={() => {
                                onEditEmployee(employee);
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit3 className="h-4 w-4 inline mr-2" />
                              Edit Employee
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteEmployee(employee.id, `${employee.first_name} ${employee.last_name}`)}
                            disabled={deletingId === employee.id}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId === employee.id ? (
                              <span className="animate-pulse">Deleting...</span>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 inline mr-2" />
                                Delete Employee
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 space-y-3">
              {/* Email */}
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                <span className="text-sm text-gray-900 break-all">{employee.email}</span>
              </div>

              {/* Role and Status Row */}
              <div className="flex items-center justify-between">
                {/* Role */}
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-gray-400 mr-3" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    employee.user_type === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {employee.user_type}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center">
                  {employee.is_active ? (
                    <>
                      <UserCheck className="h-4 w-4 mr-2 text-green-400" />
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </>
                  ) : (
                    <>
                      <UserX className="h-4 w-4 mr-2 text-red-400" />
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        Inactive
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {employee.first_name} {employee.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        @{employee.username}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <div className="text-sm text-gray-900">
                      {employee.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-gray-400" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      employee.user_type === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {employee.user_type}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {employee.is_active ? (
                      <>
                        <UserCheck className="h-4 w-4 mr-2 text-green-400" />
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </>
                    ) : (
                      <>
                        <UserX className="h-4 w-4 mr-2 text-red-400" />
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          Inactive
                        </span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleResetPassword(employee.id)}
                      className="text-blue-600 hover:text-blue-900 text-xs lg:text-sm"
                      title="Reset Password"
                    >
                      Reset Password
                    </button>
                    
                    {onEditEmployee && (
                      <button
                        onClick={() => onEditEmployee(employee)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Edit Employee"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteEmployee(employee.id, `${employee.first_name} ${employee.last_name}`)}
                      disabled={deletingId === employee.id}
                      className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                      title="Delete Employee"
                    >
                      {deletingId === employee.id ? (
                        <span className="animate-pulse text-xs">Deleting...</span>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {employees.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">No employees found.</p>
        </div>
      )}
    </>
  );
};

export default EmployeesList;