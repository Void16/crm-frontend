import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, User, Mail, Phone, Clock, CheckCircle, XCircle, Edit } from 'lucide-react';
import { adminAPI } from '../../services/api';

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, [filter]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const result = await adminAPI.getPublicFeedback(params);
      
      if (result?.ok) {
        setFeedbacks(result.data);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (feedbackId, newStatus, notes = '') => {
    try {
      const result = await adminAPI.updateFeedbackStatus(feedbackId, {
        status: newStatus,
        admin_notes: notes
      });
      
      if (result?.ok) {
        fetchFeedbacks();
        setSelectedFeedback(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      reviewed: 'bg-blue-100 text-blue-800 border-blue-300',
      resolved: 'bg-green-100 text-green-800 border-green-300',
      closed: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[status] || colors.pending;
  };

  const getTypeColor = (type) => {
    const colors = {
      complaint: 'bg-red-100 text-red-800',
      suggestion: 'bg-blue-100 text-blue-800',
      compliment: 'bg-green-100 text-green-800',
      inquiry: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.other;
  };

  const filteredFeedbacks = feedbacks.filter(feedback =>
    feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <MessageSquare className="mr-2" />
            Public Feedback
          </h2>
          <p className="text-gray-600 mt-1">
            {feedbacks.length} total submissions
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'reviewed', 'resolved', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or subject..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading feedback...</p>
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No feedback found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFeedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer"
              onClick={() => setSelectedFeedback(feedback)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">
                    {feedback.subject}
                  </h3>
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(feedback.status)}`}>
                  {feedback.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(feedback.feedback_type)}`}>
                  {feedback.feedback_type}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-1 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <User size={14} className="mr-2" />
                  {feedback.name}
                </div>
                <div className="flex items-center">
                  <Mail size={14} className="mr-2" />
                  {feedback.email}
                </div>
                {feedback.phone && (
                  <div className="flex items-center">
                    <Phone size={14} className="mr-2" />
                    {feedback.phone}
                  </div>
                )}
              </div>

              {/* Message Preview */}
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {feedback.message}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                <div className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  {new Date(feedback.created_at).toLocaleDateString()}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFeedback(feedback);
                  }}
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Edit size={12} className="mr-1" />
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedFeedback && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          onUpdate={handleUpdateStatus}
        />
      )}
    </div>
  );
};

// Feedback Detail Modal Component
const FeedbackDetailModal = ({ feedback, onClose, onUpdate }) => {
  const [newStatus, setNewStatus] = useState(feedback.status);
  const [notes, setNotes] = useState(feedback.admin_notes || '');

  const handleSubmit = () => {
    onUpdate(feedback.id, newStatus, notes);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <h3 className="text-xl font-bold text-gray-800">Feedback Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* Subject */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Subject</label>
              <p className="text-gray-800 text-lg">{feedback.subject}</p>
            </div>

            {/* Type */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Type</label>
              <p className="text-gray-800 capitalize">{feedback.feedback_type}</p>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Name</label>
                <p className="text-gray-800">{feedback.name}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <p className="text-gray-800">{feedback.email}</p>
              </div>
            </div>

            {feedback.phone && (
              <div>
                <label className="text-sm font-semibold text-gray-700">Phone</label>
                <p className="text-gray-800">{feedback.phone}</p>
              </div>
            )}

            {/* Message */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Message</label>
              <p className="text-gray-800 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                {feedback.message}
              </p>
            </div>

            {/* Status Update */}
            <div className="pt-4 border-t">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Update Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Add notes about this feedback..."
              />
            </div>

            {/* Timestamps */}
            <div className="text-xs text-gray-500 space-y-1 pt-4 border-t">
              <p>Submitted: {new Date(feedback.created_at).toLocaleString()}</p>
              {feedback.resolved_at && (
                <p>Resolved: {new Date(feedback.resolved_at).toLocaleString()}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-4 border-t">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              <CheckCircle size={18} className="mr-2" />
              Update Feedback
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackManagement;