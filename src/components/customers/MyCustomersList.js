import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Edit3, 
  User, 
  Building2, 
  Clock, 
  Calendar, 
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MapPin,
  Star,
  TrendingUp,
  AlertCircle,
  MoreVertical,
  Eye,
  Trash2,
  Download,
  Shield,
  BadgeCheck,
  MessageCircle
} from 'lucide-react';

const MyCustomersList = ({
  customers = [],
  onAddInteraction = () => {},
  onEditCustomer = () => {},
  onViewCustomer = () => {},
  onAddCustomer = () => {},
  onDeleteCustomer = () => {},
  isLoading = false,
  user = { id: 1 }
}) => {
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [selectedView, setSelectedView] = useState('grid'); // 'grid' or 'list'

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
      interactions: [
        {
          id: 1,
          notes: "Discussed Q4 implementation timeline and requirements. Client expressed strong interest in expanding to European markets next quarter.",
          timestamp: "2024-01-15T10:30:00Z",
          type: "meeting",
          duration: "45 minutes",
          follow_up_required: true,
          follow_up_date: "2024-01-22T10:30:00Z"
        },
        {
          id: 2,
          notes: "Follow-up on pricing proposal and contract negotiations. Provided detailed breakdown of enterprise features.",
          timestamp: "2024-01-10T14:15:00Z",
          type: "phone_call",
          duration: "30 minutes",
          follow_up_required: false
        },
        {
          id: 3,
          notes: "Initial product demonstration and technical requirements review. Client very impressed with analytics capabilities.",
          timestamp: "2024-01-05T11:00:00Z",
          type: "demo",
          duration: "60 minutes",
          follow_up_required: true,
          follow_up_date: "2024-01-12T11:00:00Z"
        }
      ]
    },
    {
      id: 2,
      name: "Maria Garcia",
      company: "TechStart Inc",
      title: "Chief Technology Officer",
      email: "maria.garcia@techstart.com",
      phone: "+1 (555) 987-6543",
      mobile: "+1 (555) 321-0987",
      location: "San Francisco, CA",
      industry: "SaaS",
      customer_since: "2023-03-22",
      last_interaction: "2024-01-14T16:45:00Z",
      total_interactions: 8,
      status: "active",
      priority: "medium",
      satisfaction_score: 4.2,
      revenue: 75000,
      tags: ["growth", "startup", "technical"],
      interactions: [
        {
          id: 1,
          notes: "Product demo and technical requirements review. Discussed API integration and scalability concerns.",
          timestamp: "2024-01-14T16:45:00Z",
          type: "demo",
          duration: "50 minutes",
          follow_up_required: true,
          follow_up_date: "2024-01-21T16:45:00Z"
        }
      ]
    },
    {
      id: 3,
      name: "David Chen",
      company: "Global Solutions Ltd",
      title: "Senior Product Manager",
      email: "david.chen@globalsolutions.com",
      phone: "+1 (555) 456-7890",
      mobile: "+1 (555) 890-1234",
      location: "Chicago, IL",
      industry: "Consulting",
      customer_since: "2023-06-10",
      last_interaction: "2024-01-12T09:00:00Z",
      total_interactions: 15,
      status: "active",
      priority: "high",
      satisfaction_score: 4.9,
      revenue: 150000,
      tags: ["enterprise", "long-term", "premium"],
      interactions: [
        {
          id: 1,
          notes: "Quarterly business review and strategic planning session. Discussed expansion opportunities and service improvements.",
          timestamp: "2024-01-12T09:00:00Z",
          type: "meeting",
          duration: "90 minutes",
          follow_up_required: true,
          follow_up_date: "2024-02-12T09:00:00Z"
        }
      ]
    },
    {
      id: 4,
      name: "Sarah Williams",
      company: "Innovation Labs",
      title: "Marketing Director",
      email: "sarah.williams@innovationlabs.com",
      phone: "+1 (555) 234-5678",
      mobile: "+1 (555) 876-5432",
      location: "Austin, TX",
      industry: "Marketing Tech",
      customer_since: "2023-11-05",
      last_interaction: "2024-01-08T11:45:00Z",
      total_interactions: 5,
      status: "active",
      priority: "medium",
      satisfaction_score: 4.5,
      revenue: 45000,
      tags: ["new-client", "marketing", "growing"],
      interactions: []
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
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    // Sort customers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.last_interaction) - new Date(a.last_interaction);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'company':
          return a.company.localeCompare(b.company);
        case 'interactions':
          return (b.total_interactions || 0) - (a.total_interactions || 0);
        case 'satisfaction':
          return (b.satisfaction_score || 0) - (a.satisfaction_score || 0);
        case 'revenue':
          return (b.revenue || 0) - (a.revenue || 0);
        default:
          return 0;
      }
    });

    setFilteredCustomers(filtered);
  }, [displayCustomers, searchTerm, statusFilter, sortBy]);

  const toggleExpand = (customerId) => {
    setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'meeting': return '👥';
      case 'phone_call': return '📞';
      case 'email': return '📧';
      case 'demo': return '🎯';
      default: return '💬';
    }
  };

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

  const getDaysSinceLastInteraction = (timestamp) => {
    const lastInteraction = new Date(timestamp);
    const today = new Date();
    const diffTime = Math.abs(today - lastInteraction);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">My Customers</h2>
            <p className="text-gray-600 text-lg">
              Manage your assigned customers and track interactions
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={onAddCustomer}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="h-5 w-5" />
              Add Customer
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
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
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name A-Z</option>
              <option value="company">Company A-Z</option>
              <option value="interactions">Most Interactions</option>
              <option value="satisfaction">Satisfaction</option>
              <option value="revenue">Revenue</option>
            </select>

            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setSelectedView('grid')}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  selectedView === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setSelectedView('list')}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  selectedView === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-900">{filteredCustomers.length}</div>
          <div className="text-blue-700 text-sm">Total Customers</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-2xl font-bold text-green-900">
            {filteredCustomers.filter(c => c.interactions && c.interactions.length > 0).length}
          </div>
          <div className="text-green-700 text-sm">With Interactions</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-2xl font-bold text-purple-900">
            {filteredCustomers.filter(c => c.priority === 'high').length}
          </div>
          <div className="text-purple-700 text-sm">High Priority</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="text-2xl font-bold text-orange-900">
            {formatCurrency(filteredCustomers.reduce((sum, c) => sum + (c.revenue || 0), 0))}
          </div>
          <div className="text-orange-700 text-sm">Total Revenue</div>
        </div>
      </div>

      {/* Customers Grid */}
      <div className={`grid gap-6 ${
        selectedView === 'grid' 
          ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-2' 
          : 'grid-cols-1'
      }`}>
        {filteredCustomers.map((customer) => {
          const isExpanded = expandedCustomer === customer.id;
          const daysSinceLastInteraction = customer.last_interaction 
            ? getDaysSinceLastInteraction(customer.last_interaction)
            : null;

          return (
            <div 
              key={customer.id} 
              className="bg-white rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Customer Header */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        <h3 className="text-xl font-semibold text-gray-900 truncate">
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
                      className="p-1.5 hover:bg-white rounded-lg transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Badges and Metrics */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(customer.priority)}`}>
                      {customer.priority?.toUpperCase() || 'NORMAL'}
                    </span>
                    {customer.tags?.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-white text-gray-700 px-2 py-1 rounded-full text-xs border"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{customer.total_interactions || 0}</span>
                    </div>
                    {customer.satisfaction_score && (
                      <div className="flex items-center gap-1">
                        {renderStars(customer.satisfaction_score)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="p-4">
                {/* Contact and Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                    <div className="space-y-2">
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
                      {customer.location && (
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{customer.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Customer Details</h4>
                    <div className="space-y-2 text-sm">
                      {customer.title && (
                        <div className="flex items-center gap-2">
                          <BadgeCheck className="h-4 w-4 text-blue-500" />
                          <span className="text-gray-600">{customer.title}</span>
                        </div>
                      )}
                      {customer.industry && (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{customer.industry}</span>
                        </div>
                      )}
                      {customer.revenue && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-gray-600">{formatCurrency(customer.revenue)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Interactions */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Recent Interactions</h4>
                    {customer.interactions && customer.interactions.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {customer.interactions.length} total
                        </span>
                        {daysSinceLastInteraction > 7 && (
                          <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                            <AlertCircle className="h-3 w-3" />
                            {daysSinceLastInteraction}d ago
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {customer.interactions && customer.interactions.length > 0 ? (
                      customer.interactions.slice(0, 2).map((interaction, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-300">
                          <div className="flex items-start gap-2 mb-2">
                            <span className="text-lg flex-shrink-0">
                              {getInteractionIcon(interaction.type)}
                            </span>
                            <p className="text-sm text-gray-700 leading-relaxed flex-1">
                              {interaction.notes}
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{formatDate(interaction.timestamp)}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{formatTime(interaction.timestamp)}</span>
                              </div>
                              {interaction.duration && (
                                <span className="bg-white px-2 py-1 rounded">
                                  {interaction.duration}
                                </span>
                              )}
                            </div>
                            {interaction.follow_up_required && (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                Follow-up
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-6 text-center border-2 border-dashed border-gray-200">
                        <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-sm text-gray-500 mb-2">No interactions yet</p>
                        <p className="text-xs text-gray-400 mb-4">Start building your relationship with this customer</p>
                        <button
                          onClick={() => onAddInteraction(customer)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Add First Interaction
                        </button>
                      </div>
                    )}
                    
                    {customer.interactions && customer.interactions.length > 2 && (
                      <div className="text-center">
                        <button
                          onClick={() => toggleExpand(customer.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-full transition-colors"
                        >
                          +{customer.interactions.length - 2} more interactions
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable Detailed View */}
              {isExpanded && customer.interactions && customer.interactions.length > 2 && (
                <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">All Interactions</h4>
                  <div className="space-y-3">
                    {customer.interactions.slice(2).map((interaction, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 border">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-lg flex-shrink-0">
                            {getInteractionIcon(interaction.type)}
                          </span>
                          <p className="text-sm text-gray-700 leading-relaxed flex-1">
                            {interaction.notes}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{formatDate(interaction.timestamp)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{formatTime(interaction.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {customer.last_interaction && (
                      <>
                        <Clock className="h-3 w-3" />
                        <span>Last contact: {formatDate(customer.last_interaction)}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onAddInteraction(customer)}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="hidden sm:inline">Add Interaction</span>
                    </button>
                    <button
                      onClick={() => onEditCustomer(customer)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit Customer"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onViewCustomer(customer)}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <User className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-2xl font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all'
              ? 'No matching customers found'
              : 'No customers assigned yet'
            }
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search criteria or filters to see more results.'
              : 'Start building your customer portfolio by adding your first customer.'
            }
          </p>
          <button
            onClick={onAddCustomer}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="h-5 w-5" />
            Add Your First Customer
          </button>
        </div>
      )}

      {/* Footer Summary */}
      {filteredCustomers.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredCustomers.length} of {displayCustomers.length} customers
        </div>
      )}
    </div>
  );
};

export default MyCustomersList;