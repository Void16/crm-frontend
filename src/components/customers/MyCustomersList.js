import React from 'react';
import { Mail, Phone, MessageSquare, Edit3, User, Building2, Clock, Calendar, Plus } from 'lucide-react';

const MyCustomersList = ({
  customers = [],
  onAddInteraction = () => {},
  onEditCustomer = () => {},
  onAddCustomer = () => {}, // This prop should be passed from Dashboard
  onDeleteCustomer = () => {} // Optional: if you want delete functionality
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
      interactions: [
        {
          notes: "Discussed Q4 implementation timeline and requirements",
          timestamp: "2024-01-15T10:30:00Z"
        },
        {
          notes: "Follow-up on pricing proposal",
          timestamp: "2024-01-10T14:15:00Z"
        }
      ]
    },
    {
      id: 2,
      name: "Maria Garcia",
      company: "TechStart Inc",
      title: "CTO",
      email: "maria@techstart.com",
      phone: "+1 (555) 987-6543",
      interactions: [
        {
          notes: "Product demo and technical requirements review",
          timestamp: "2024-01-12T16:45:00Z"
        }
      ]
    },
    {
      id: 3,
      name: "David Chen",
      company: "Global Solutions Ltd",
      title: "Product Manager",
      email: "david@globalsolutions.com",
      phone: "+1 (555) 456-7890",
      interactions: []
    }
  ];

  const displayCustomers = customers.length > 0 ? customers : sampleCustomers;

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Header Section with Add Customer Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Customers</h2>
          <p className="text-gray-600">Customers assigned to you with recent interactions</p>
        </div>
        
        {/* Add Customer Button */}
        {/* <button
          onClick={onAddCustomer}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Customer
        </button> */}
      </div>

      {/* Mobile-optimized card layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayCustomers.map((customer) => (
          <div 
            key={customer.id} 
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            {/* Customer header */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-4 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 mr-2 text-purple-500 flex-shrink-0" />
                    <h3 className="text-xl font-semibold text-gray-900 truncate">
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
                
                {/* Desktop action buttons */}
                <div className="hidden sm:flex flex-col gap-1 ml-4">
                  <button
                    onClick={() => onAddInteraction(customer)}
                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                    title="Add Interaction"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEditCustomer(customer)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Customer"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Contact and interactions section */}
            <div className="p-4">
              {/* Contact information */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                <div className="space-y-2">
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
                </div>
              </div>

              {/* Recent interactions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Recent Interactions</h4>
                  {customer.interactions && customer.interactions.length > 0 && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {customer.interactions.length} total
                    </span>
                  )}
                </div>
                
                <div className="space-y-3">
                  {customer.interactions && customer.interactions.length > 0 ? (
                    customer.interactions.slice(0, 2).map((interaction, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-200">
                        <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                          {interaction.notes}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span className="mr-3">{formatDate(interaction.timestamp)}</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatTime(interaction.timestamp)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <MessageSquare className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">No interactions yet</p>
                      <p className="text-xs text-gray-400 mt-1">Add your first interaction to get started</p>
                    </div>
                  )}
                  
                  {customer.interactions && customer.interactions.length > 2 && (
                    <div className="text-center">
                      <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        +{customer.interactions.length - 2} more interactions
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile action buttons */}
            <div className="sm:hidden bg-gray-50 px-4 py-3 border-t border-gray-200">
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => onAddInteraction(customer)}
                  className="flex items-center px-4 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Note
                </button>
                <button
                  onClick={() => onEditCustomer(customer)}
                  className="flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state with enhanced Add Customer button */}
      {displayCustomers.length === 0 && (
        <div className="text-center py-12">
          <User className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers assigned yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first customer</p>
          <button
            onClick={onAddCustomer}
            className="flex items-center justify-center mx-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Customer
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCustomersList;