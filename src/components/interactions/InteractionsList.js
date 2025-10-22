import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  User, 
  Building2, 
  MessageSquare, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Clock,
  MapPin,
  Star,
  MoreVertical,
  Briefcase,
  Award
} from 'lucide-react';

const InteractionsList = ({ 
  interactions = [], 
  onInteractionSelect,
  onAddInteraction,
  onEditInteraction,
  onDeleteInteraction,
  showActions = false,
  isLoading = false 
}) => {
  const [filteredInteractions, setFilteredInteractions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [expandedInteractions, setExpandedInteractions] = useState(new Set());
  const [sortBy, setSortBy] = useState('newest');
  const [selectedInteraction, setSelectedInteraction] = useState(null);

  // Sample data with company and title information
  const sampleInteractions = [
    {
      id: 1,
      customer_name: "John Smith",
      customer_title: "Chief Technology Officer",
      customer_company: "Acme Corporation",
      customer_id: "CUST-001",
      employee_name: "Sarah Johnson",
      employee_id: "EMP-001",
      notes: "Discussed product requirements and timeline for Q4 implementation. Customer showed strong interest in premium features and requested a detailed demo next week. They're particularly interested in the analytics dashboard and reporting capabilities.",
      timestamp: "2024-01-15T10:30:00Z",
      type: "meeting",
      status: "completed",
      duration: "45 minutes",
      location: "Virtual Meeting",
      follow_up_required: true,
      follow_up_date: "2024-01-22T10:30:00Z",
      priority: "high",
      tags: ["product-demo", "q4-planning", "premium-features"],
      satisfaction_rating: 4
    },
    {
      id: 2,
      customer_name: "Emily Chen",
      customer_title: "Procurement Manager",
      customer_company: "TechStart Inc",
      customer_id: "CUST-002",
      employee_name: "Mike Davis",
      employee_id: "EMP-002",
      notes: "Follow-up call regarding pricing concerns. Provided detailed breakdown of costs and offered flexible payment options. Customer appreciated the transparency and is considering the enterprise package.",
      timestamp: "2024-01-14T14:15:00Z",
      type: "phone_call",
      status: "completed",
      duration: "30 minutes",
      location: "Phone",
      follow_up_required: true,
      follow_up_date: "2024-01-21T14:15:00Z",
      priority: "medium",
      tags: ["pricing", "enterprise", "payment-options"],
      satisfaction_rating: 5
    },
    {
      id: 3,
      customer_name: "Robert Martinez",
      customer_title: "Operations Director",
      customer_company: "Global Solutions Ltd",
      customer_id: "CUST-003",
      employee_name: "Lisa Wong",
      employee_id: "EMP-003",
      notes: "Initial consultation meeting. Identified key pain points in their current workflow process. Discussed potential solutions and scheduled a technical deep-dive session.",
      timestamp: "2024-01-13T09:00:00Z",
      type: "meeting",
      status: "completed",
      duration: "60 minutes",
      location: "Client Office",
      follow_up_required: true,
      follow_up_date: "2024-01-20T09:00:00Z",
      priority: "high",
      tags: ["consultation", "workflow", "technical-deep-dive"],
      satisfaction_rating: 4
    },
    {
      id: 4,
      customer_name: "Jennifer Wilson",
      customer_title: "Marketing Coordinator",
      customer_company: "Innovation Labs",
      customer_id: "CUST-004",
      employee_name: "David Kim",
      employee_id: "EMP-004",
      notes: "Quick check-in to discuss ongoing project status. Everything is on track for the upcoming milestone delivery. Jennifer requested some additional marketing materials for their upcoming campaign.",
      timestamp: "2024-01-12T16:45:00Z",
      type: "email",
      status: "completed",
      duration: "15 minutes",
      location: "Email",
      follow_up_required: false,
      priority: "low",
      tags: ["check-in", "milestone", "project-update", "marketing"],
      satisfaction_rating: 5
    },
    {
      id: 5,
      customer_name: "Michael Brown",
      customer_title: "CEO & Founder",
      customer_company: "StartUp Ventures",
      customer_id: "CUST-005",
      employee_name: "Sarah Johnson",
      employee_id: "EMP-001",
      notes: "Strategic discussion about long-term partnership opportunities. Michael expressed interest in exploring co-marketing initiatives and joint venture possibilities for the next quarter.",
      timestamp: "2024-01-11T11:00:00Z",
      type: "meeting",
      status: "completed",
      duration: "90 minutes",
      location: "Executive Boardroom",
      follow_up_required: true,
      follow_up_date: "2024-01-25T11:00:00Z",
      priority: "high",
      tags: ["strategic", "partnership", "co-marketing", "joint-venture"],
      satisfaction_rating: 5
    }
  ];

  const displayInteractions = interactions.length > 0 ? interactions : sampleInteractions;

  // Filter and sort interactions
  useEffect(() => {
    let filtered = displayInteractions;

    // Search filter - now includes company and title
    if (searchTerm) {
      filtered = filtered.filter(interaction =>
        interaction.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interaction.customer_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interaction.customer_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interaction.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interaction.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interaction.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(interaction => interaction.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filteredDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(interaction => 
            new Date(interaction.timestamp).toDateString() === now.toDateString()
          );
          break;
        case 'week':
          filteredDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(interaction => 
            new Date(interaction.timestamp) >= filteredDate
          );
          break;
        case 'month':
          filteredDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(interaction => 
            new Date(interaction.timestamp) >= filteredDate
          );
          break;
        default:
          break;
      }
    }

    // Sort interactions - added company sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'customer':
          return a.customer_name.localeCompare(b.customer_name);
        case 'company':
          return (a.customer_company || '').localeCompare(b.customer_company || '');
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        default:
          return 0;
      }
    });

    setFilteredInteractions(filtered);
  }, [displayInteractions, searchTerm, statusFilter, dateFilter, sortBy]);

  const toggleExpand = (interactionId) => {
    const newExpanded = new Set(expandedInteractions);
    if (newExpanded.has(interactionId)) {
      newExpanded.delete(interactionId);
    } else {
      newExpanded.add(interactionId);
    }
    setExpandedInteractions(newExpanded);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'meeting': return '👥';
      case 'phone_call': return '📞';
      case 'email': return '📧';
      case 'demo': return '🎯';
      case 'support': return '🔧';
      default: return '💬';
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    return duration;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Customer Interactions</h2>
            <p className="text-gray-600 text-lg">
              Track and manage all customer touchpoints and communications
            </p>
          </div>
          {onAddInteraction && (
            <button
              onClick={onAddInteraction}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-sm"
            >
              <Plus className="h-5 w-5" />
              Add Interaction
            </button>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, company, title..."
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
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>

            {/* Sort By - Added company option */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="customer">Customer Name</option>
              <option value="company">Company Name</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-900">{filteredInteractions.length}</div>
          <div className="text-blue-700 text-sm">Total Interactions</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-2xl font-bold text-green-900">
            {filteredInteractions.filter(i => i.follow_up_required).length}
          </div>
          <div className="text-green-700 text-sm">Follow-ups Required</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-2xl font-bold text-purple-900">
            {[...new Set(filteredInteractions.map(i => i.customer_company))].length}
          </div>
          <div className="text-purple-700 text-sm">Companies</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="text-2xl font-bold text-orange-900">
            {filteredInteractions.filter(i => i.priority === 'high').length}
          </div>
          <div className="text-orange-700 text-sm">High Priority</div>
        </div>
      </div>

      {/* Interactions List */}
      <div className="space-y-4">
        {filteredInteractions.map((interaction) => {
          const isExpanded = expandedInteractions.has(interaction.id);
          const isSelected = selectedInteraction === interaction.id;

          return (
            <div 
              key={interaction.id} 
              className={`bg-white rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                isSelected 
                  ? 'border-blue-500 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {/* Header section */}
              <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">{getTypeIcon(interaction.type)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      {/* Customer Name and Title */}
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <h3 className="text-xl font-semibold text-gray-900 truncate">
                          {interaction.customer_name}
                        </h3>
                        {interaction.customer_title && (
                          <span className="hidden sm:inline-flex items-center gap-1 text-sm text-gray-600 bg-blue-50 px-2 py-1 rounded">
                            <Award className="h-3 w-3" />
                            {interaction.customer_title}
                          </span>
                        )}
                      </div>

                      {/* Company Information */}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        {interaction.customer_company && (
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            <span className="font-medium">{interaction.customer_company}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <span className="text-gray-400">•</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded ml-2">
                            {interaction.customer_id}
                          </span>
                        </div>
                      </div>

                      {/* Interaction Details */}
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-1">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(interaction.timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDuration(interaction.duration)}
                        </div>
                        {interaction.location && (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {interaction.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Priority Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(interaction.priority)}`}>
                      {interaction.priority?.toUpperCase() || 'NORMAL'}
                    </span>

                    {/* Satisfaction Rating */}
                    {interaction.satisfaction_rating && (
                      <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border">
                        {renderStars(interaction.satisfaction_rating)}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleExpand(interaction.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-gray-600" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-600" />
                        )}
                      </button>

                      {showActions && (
                        <div className="relative">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expandable Content */}
              {isExpanded && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Notes Section */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="h-5 w-5 text-gray-500" />
                        <h4 className="font-semibold text-gray-900">Interaction Notes</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-lg border">
                        {interaction.notes}
                      </p>

                      {/* Employee Information */}
                      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Handled by:</span>
                        <User className="h-4 w-4" />
                        <span>{interaction.employee_name}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {interaction.employee_id}
                        </span>
                      </div>
                    </div>

                    {/* Metadata Section */}
                    <div className="space-y-4">
                      {/* Customer Details Card */}
                      <div className="bg-white rounded-lg border p-4">
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Customer Details
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Name:</span>
                            <div className="text-gray-900">{interaction.customer_name}</div>
                          </div>
                          {interaction.customer_title && (
                            <div>
                              <span className="font-medium text-gray-700">Title:</span>
                              <div className="text-gray-900 flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                {interaction.customer_title}
                              </div>
                            </div>
                          )}
                          {interaction.customer_company && (
                            <div>
                              <span className="font-medium text-gray-700">Company:</span>
                              <div className="text-gray-900 flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {interaction.customer_company}
                              </div>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-700">Customer ID:</span>
                            <div className="text-gray-900">{interaction.customer_id}</div>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      {interaction.tags && interaction.tags.length > 0 && (
                        <div className="bg-white rounded-lg border p-4">
                          <h5 className="font-medium text-gray-900 mb-2">Tags</h5>
                          <div className="flex flex-wrap gap-1">
                            {interaction.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Follow-up Information */}
                      {interaction.follow_up_required && interaction.follow_up_date && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <h5 className="font-medium text-yellow-900 mb-1">Follow-up Required</h5>
                          <p className="text-yellow-800 text-sm">
                            Scheduled for {new Date(interaction.follow_up_date).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {showActions && (
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => onViewInteraction?.(interaction)}
                            className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                          <button
                            onClick={() => onEditInteraction?.(interaction)}
                            className="flex items-center gap-1 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteInteraction?.(interaction.id)}
                            className="flex items-center gap-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
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
      {filteredInteractions.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-2xl font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
              ? 'No matching interactions found' 
              : 'No interactions yet'
            }
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
              ? 'Try adjusting your search criteria or filters to see more results.'
              : 'Start tracking your customer interactions to build better relationships and improve customer satisfaction.'
            }
          </p>
          {onAddInteraction && (
            <button
              onClick={onAddInteraction}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              Add Your First Interaction
            </button>
          )}
        </div>
      )}

      {/* Footer Summary */}
      {filteredInteractions.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredInteractions.length} of {displayInteractions.length} interactions
          {filteredInteractions.length > 0 && (
            <span className="ml-2">
              across {[...new Set(filteredInteractions.map(i => i.customer_company))].length} companies
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractionsList;