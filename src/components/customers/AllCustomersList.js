import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Edit3, 
  User, 
  Building2, 
  UserCheck,
  Search,
  Filter,
  MoreVertical,
  MapPin,
  Calendar,
  Clock,
  Star,
  ChevronDown,
  ChevronUp,
  Plus,
  Download,
  Eye,
  Trash2,
  Shield,
  BadgeCheck,
  AlertCircle
} from 'lucide-react';

const AllCustomersList = ({
  customers = [],
  user = { id: 1, user_type: 'employee' },
  onAddInteraction = () => {},
  onEditCustomer = () => {},
  onViewCustomer = () => {},
  onDeleteCustomer = () => {},
  isLoading = false,
  showActions = true
}) => {
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assignedFilter, setAssignedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [selectedCustomers, setSelectedCustomers] = useState(new Set());

  // Enhanced sample data with more realistic information
  const sampleCustomers = [
    {
      id: 1,
      name: "John Smith",
      company: "Acme Corporation",
      title: "Chief Executive Officer",
      email: "john.smith@acme-corp.com",
      phone: "+1 (555) 123-4567",
      mobile: "+1 (555) 765-4321",
      assigned_employee: 1,
      assigned_employee_name: "Sarah Johnson",
      location: "New York, NY",
      industry: "Technology",
      customer_since: "2023-01-15",
      last_interaction: "2024-01-15T10:30:00Z",
      total_interactions: 12,
      status: "active",
      priority: "high",
      satisfaction_score: 4.8,
      revenue: 125000,
      tags: ["enterprise", "strategic", "key-account"],
      notes: "Very satisfied with our premium services. Interested in expanding to European market."
    },
    {
      id: 2,
      name: "Maria Garcia",
      company: "TechStart Inc",
      title: "Chief Technology Officer",
      email: "maria.garcia@techstart.com",
      phone: "+1 (555) 987-6543",
      mobile: "+1 (555) 321-0987",
      assigned_employee: 2,
      assigned_employee_name: "Mike Davis",
      location: "San Francisco, CA",
      industry: "SaaS",
      customer_since: "2023-03-22",
      last_interaction: "2024-01-14T14:15:00Z",
      total_interactions: 8,
      status: "active",
      priority: "medium",
      satisfaction_score: 4.2,
      revenue: 75000,
      tags: ["growth", "startup", "technical"],
      notes: "Currently evaluating our enterprise package. Technical team very engaged."
    },
    {
      id: 3,
      name: "David Chen",
      company: "Global Solutions Ltd",
      title: "Senior Product Manager",
      email: "david.chen@globalsolutions.com",
      phone: "+1 (555) 456-7890",
      mobile: "+1 (555) 890-1234",
      assigned_employee: 1,
      assigned_employee_name: "Sarah Johnson",
      location: "Chicago, IL",
      industry: "Consulting",
      customer_since: "2023-06-10",
      last_interaction: "2024-01-13T09:00:00Z",
      total_interactions: 15,
      status: "active",
      priority: "high",
      satisfaction_score: 4.9,
      revenue: 150000,
      tags: ["enterprise", "long-term", "premium"],
      notes: "One of our most valuable clients. Regular communication required."
    },
    {
      id: 4,
      name: "Sarah Williams",
      company: "Innovation Labs",
      title: "Marketing Director",
      email: "sarah.williams@innovationlabs.com",
      phone: "+1 (555) 234-5678",
      mobile: "+1 (555) 876-5432",
      assigned_employee: 3,
      assigned_employee_name: "Alex Thompson",
      location: "Austin, TX",
      industry: "Marketing Tech",
      customer_since: "2023-11-05",
      last_interaction: "2024-01-10T11:45:00Z",
      total_interactions: 5,
      status: "active",
      priority: "medium",
      satisfaction_score: 4.5,
      revenue: 45000,
      tags: ["new-client", "marketing", "growing"],
      notes: "Recently onboarded. Very responsive and collaborative."
    },
    {
      id: 5,
      name: "Robert Kim",
      company: "Data Dynamics",
      title: "Head of Data Science",
      email: "robert.kim@datadynamics.ai",
      phone: "+1 (555) 345-6789",
      mobile: "+1 (555) 987-6543",
      assigned_employee: 2,
      assigned_employee_name: "Mike Davis",
      location: "Seattle, WA",
      industry: "Artificial Intelligence",
      customer_since: "2023-08-18",
      last_interaction: "2024-01-08T16:20:00Z",
      total_interactions: 7,
      status: "inactive",
      priority: "low",
      satisfaction_score: 3.8,
      revenue: 35000,
      tags: ["technical", "ai-ml", "evaluation"],
      notes: "Currently in evaluation phase. Requires technical demonstrations."
    }
  ];

  const displayCustomers = customers.length > 0 ? customers : sampleCustomers;

  // Filter and sort customers
  useEffect(() => {
    let filtered = displayCustomers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    // Assigned filter
    if (assignedFilter !== 'all') {
      if (assignedFilter === 'me') {
        filtered = filtered.filter(customer => customer.assigned_employee === user?.id);
      } else if (assignedFilter === 'others') {
        filtered = filtered.filter(customer => customer.assigned_employee !== user?.id);
      }
    }

    // Sort customers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'company':
          return a.company.localeCompare(b.company);
        case 'recent':
          return new Date(b.last_interaction) - new Date(a.last_interaction);
        case 'revenue':
          return (b.revenue || 0) - (a.revenue || 0);
        case 'satisfaction':
          return (b.satisfaction_score || 0) - (a.satisfaction_score || 0);
        case 'interactions':
          return (b.total_interactions || 0) - (a.total_interactions || 0);
        default:
          return 0;
      }
    });

    setFilteredCustomers(filtered);
  }, [displayCustomers, searchTerm, statusFilter, assignedFilter, sortBy, user?.id]);

  const toggleExpand = (customerId) => {
    setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
  };

  const toggleSelectCustomer = (customerId) => {
    const newSelected = new Set(selectedCustomers);
    if (newSelected.has(customerId)) {
      newSelected.delete(customerId);
    } else {
      newSelected.add(customerId);
    }
    setSelectedCustomers(newSelected);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const isAssignedToMe = (customer) => customer.assigned_employee === user?.id;
  const canEdit = (customer) => isAssignedToMe(customer) || user?.user_type === 'admin';

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Customer Portfolio</h2>
            <p className="text-gray-600 text-lg">
              Manage and track all customer relationships and interactions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
            {user?.user_type === 'admin' && (
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                <Plus className="h-4 w-4" />
                Add Customer
              </button>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers by name, company, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="prospect">Prospect</option>
            </select>

            {/* Assigned Filter */}
            <select
              value={assignedFilter}
              onChange={(e) => setAssignedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Customers</option>
              <option value="me">Assigned to Me</option>
              <option value="others">Assigned to Others</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="company">Sort by Company</option>
              <option value="recent">Sort by Recent</option>
              <option value="revenue">Sort by Revenue</option>
              <option value="satisfaction">Sort by Satisfaction</option>
              <option value="interactions">Sort by Interactions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-900">{filteredCustomers.length}</div>
          <div className="text-blue-700 text-sm">Total Customers</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-2xl font-bold text-green-900">
            {filteredCustomers.filter(c => c.status === 'active').length}
          </div>
          <div className="text-green-700 text-sm">Active</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-2xl font-bold text-purple-900">
            {filteredCustomers.filter(c => c.assigned_employee === user?.id).length}
          </div>
          <div className="text-purple-700 text-sm">Assigned to Me</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="text-2xl font-bold text-orange-900">
            {filteredCustomers.filter(c => c.priority === 'high').length}
          </div>
          <div className="text-orange-700 text-sm">High Priority</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="text-2xl font-bold text-red-900">
            {filteredCustomers.filter(c => c.satisfaction_score < 4).length}
          </div>
          <div className="text-red-700 text-sm">Needs Attention</div>
        </div>
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <div className="text-2xl font-bold text-indigo-900">
            {formatCurrency(filteredCustomers.reduce((sum, c) => sum + (c.revenue || 0), 0))}
          </div>
          <div className="text-indigo-700 text-sm">Total Revenue</div>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => {
          const isExpanded = expandedCustomer === customer.id;
          const isSelected = selectedCustomers.has(customer.id);
          const assignedToMe = isAssignedToMe(customer);

          return (
            <div 
              key={customer.id} 
              className={`bg-white rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                isSelected 
                  ? 'border-blue-500 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              } ${!assignedToMe ? 'opacity-90' : ''}`}
            >
              {/* Customer Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {customer.name}
                        </h3>
                        {customer.priority === 'high' && (
                          <Shield className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{customer.company}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleExpand(customer.id)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                    {customer.status?.toUpperCase() || 'ACTIVE'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(customer.priority)}`}>
                    {customer.priority?.toUpperCase() || 'NORMAL'}
                  </span>
                  {customer.tags?.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                  {customer.tags && customer.tags.length > 2 && (
                    <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                      +{customer.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Customer Details */}
              <div className="p-4">
                {/* Title and Industry */}
                <div className="mb-4">
                  {customer.title && (
                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                      <BadgeCheck className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{customer.title}</span>
                    </div>
                  )}
                  {customer.industry && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{customer.industry} • {customer.location}</span>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <a 
                      href={`mailto:${customer.email}`}
                      className="text-sm text-blue-600 hover:text-blue-800 truncate"
                    >
                      {customer.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <a 
                      href={`tel:${customer.phone}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {customer.phone}
                    </a>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 py-3 border-y border-gray-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{customer.total_interactions || 0}</div>
                    <div className="text-xs text-gray-500">Interactions</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {renderStars(customer.satisfaction_score || 0)}
                    </div>
                    <div className="text-xs text-gray-500">Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {customer.revenue ? formatCurrency(customer.revenue) : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                </div>

                {/* Assigned Employee */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {customer.assigned_employee_name}
                    </span>
                    {assignedToMe && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </div>

                  {/* Last Interaction */}
                  {customer.last_interaction && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {new Date(customer.last_interaction).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Expandable Detailed Information */}
              {isExpanded && (
                <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
                  {/* Customer Notes */}
                  {customer.notes && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Notes</h4>
                      <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border">
                        {customer.notes}
                      </p>
                    </div>
                  )}

                  {/* Additional Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {customer.customer_since && (
                      <div>
                        <span className="font-medium text-gray-700">Customer Since:</span>
                        <div className="text-gray-900 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(customer.customer_since).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                    {customer.mobile && (
                      <div>
                        <span className="font-medium text-gray-700">Mobile:</span>
                        <div className="text-gray-900">{customer.mobile}</div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {showActions && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => onAddInteraction(customer)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Add Interaction
                      </button>
                      {canEdit(customer) && (
                        <>
                          <button
                            onClick={() => onEditCustomer(customer)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => onViewCustomer(customer)}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {user?.user_type === 'admin' && (
                        <button
                          onClick={() => onDeleteCustomer(customer.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Quick Actions Footer */}
              {!isExpanded && showActions && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {customer.last_interaction && (
                        <>
                          <Clock className="h-3 w-3" />
                          Last: {new Date(customer.last_interaction).toLocaleDateString()}
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onAddInteraction(customer)}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                        title="Add Interaction"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      {canEdit(customer) && (
                        <button
                          onClick={() => onEditCustomer(customer)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Customer"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      )}
                      {user?.user_type === 'admin' && (
                        <button
                          onClick={() => onDeleteCustomer(customer.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Customer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-2xl font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' || assignedFilter !== 'all'
              ? 'No matching customers found'
              : 'No customers yet'
            }
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {searchTerm || statusFilter !== 'all' || assignedFilter !== 'all'
              ? 'Try adjusting your search criteria or filters to see more results.'
              : 'Start building your customer portfolio by adding your first customer record.'
            }
          </p>
          {user?.user_type === 'admin' && (
            <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
              <Plus className="h-5 w-5" />
              Add Your First Customer
            </button>
          )}
        </div>
      )}

      {/* Footer Summary */}
      {filteredCustomers.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredCustomers.length} of {displayCustomers.length} customers
          {selectedCustomers.size > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {selectedCustomers.size} selected
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AllCustomersList;