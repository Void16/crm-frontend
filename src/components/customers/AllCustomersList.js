import React from 'react';
import { Mail, Phone, MessageSquare, Edit3, Trash2, User, Building2, UserCheck } from 'lucide-react';

const AllCustomersList = ({
  customers = [],
  user = { id: 1 },
  onAddInteraction = () => {},
  onEditCustomer = () => {},
  onDeleteCustomer = () => {}
}) => {
  // Sample data for demonstration
  const sampleCustomers = [
    {
      id: 1,
      name: "John Smith",
      company: "Acme Corporation",
      title: "CEO",
      email: "john@acme.com",
      phone: "+1 (555) 123-4567",
      assigned_employee: 1,
      assigned_employee_name: "Sarah Johnson"
    },
    {
      id: 2,
      name: "Maria Garcia",
      company: "TechStart Inc",
      title: "CTO",
      email: "maria@techstart.com",
      phone: "+1 (555) 987-6543",
      assigned_employee: 2,
      assigned_employee_name: "Mike Davis"
    },
    {
      id: 3,
      name: "David Chen",
      company: "Global Solutions Ltd",
      title: "Product Manager",
      email: "david@globalsolutions.com",
      phone: "+1 (555) 456-7890",
      assigned_employee: 1,
      assigned_employee_name: "Sarah Johnson"
    }
  ];

  const displayCustomers = customers.length > 0 ? customers : sampleCustomers;

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">All Customers</h2>
        <p className="text-gray-600">Manage your customer relationships</p>
      </div>

      {/* Mobile-optimized card layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayCustomers.map((customer) => (
          <div 
            key={customer.id} 
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            {/* Customer header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-1">
                    <User className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {customer.name}
                    </h3>
                  </div>
                  <div className="flex items-center mb-1">
                    <Building2 className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                    <p className="text-sm text-gray-700 truncate">
                      {customer.company}
                    </p>
                  </div>
                  {customer.title && (
                    <p className="text-xs text-gray-500 ml-6">
                      {customer.title}
                    </p>
                  )}
                </div>
                
                {/* Action buttons - desktop */}
                {customer.assigned_employee === user?.id && (
                  <div className="hidden sm:flex flex-col gap-1 ml-2">
                    <button
                      onClick={() => onAddInteraction(customer)}
                      className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                      title="Add Interaction"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEditCustomer(customer)}
                      className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      title="Edit Customer"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteCustomer(customer.id)}
                      className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Delete Customer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Contact information */}
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                  <a 
                    href={`mailto:${customer.email}`}
                    className="text-sm text-blue-600 hover:text-blue-800 truncate"
                  >
                    {customer.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                  <a 
                    href={`tel:${customer.phone}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {customer.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <UserCheck className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    {customer.assigned_employee_name}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile action buttons */}
            {customer.assigned_employee === user?.id && (
              <div className="sm:hidden bg-gray-50 px-4 py-3 border-t border-gray-200">
                <div className="flex justify-center space-x-6">
                  <button
                    onClick={() => onAddInteraction(customer)}
                    className="flex items-center px-3 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Note
                  </button>
                  <button
                    onClick={() => onEditCustomer(customer)}
                    className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteCustomer(customer.id)}
                    className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}

            {/* Non-assigned customer indicator */}
            {customer.assigned_employee !== user?.id && (
              <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Managed by {customer.assigned_employee_name}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {displayCustomers.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers yet</h3>
          <p className="text-gray-600">Customer records will appear here when available.</p>
        </div>
      )}
    </div>
  );
};

export default AllCustomersList;