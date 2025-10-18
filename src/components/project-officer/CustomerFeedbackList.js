import React from 'react';
import { Star, User, Calendar, MessageCircle } from 'lucide-react';

const CustomerFeedbackList = ({ feedbacks, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading feedback...</span>
      </div>
    );
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  const getRatingText = (rating) => {
    const ratings = {
      1: 'Very Dissatisfied',
      2: 'Dissatisfied',
      3: 'Neutral',
      4: 'Satisfied',
      5: 'Very Satisfied'
    };
    return ratings[rating] || 'No rating';
  };

  return (
    <div className="space-y-4">
      {feedbacks.length > 0 ? (
        feedbacks.map((feedback) => (
          <div key={feedback.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              {/* Left Section - Feedback Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {feedback.customer_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {new Date(feedback.feedback_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                {feedback.customer_rating && (
                  <div className="mb-3">
                    {renderStars(feedback.customer_rating)}
                    <p className="text-sm text-gray-600 mt-1">
                      {getRatingText(feedback.customer_rating)}
                    </p>
                  </div>
                )}

                {/* Feedback Comments */}
                {feedback.customer_feedback && (
                  <div className="flex items-start gap-2">
                    <MessageCircle className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 leading-relaxed">
                      "{feedback.customer_feedback}"
                    </p>
                  </div>
                )}
              </div>

              {/* Right Section - Issue Info */}
              <div className="sm:text-right">
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Meter ID:</strong> {feedback.meter_id}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Issue:</strong> {feedback.issue_type}
                </div>
                {feedback.resolved_by && (
                  <div className="text-sm text-gray-600 mt-1">
                    <strong>Resolved by:</strong> {feedback.resolved_by}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No customer feedback available</p>
          <p className="text-sm text-gray-400 mt-1">
            Customer feedback will appear here once submitted
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerFeedbackList;