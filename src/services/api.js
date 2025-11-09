import { API_BASE_URL } from '../utils/constants';

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  try {
    console.log('API Call:', `${API_BASE_URL}${endpoint}`, options);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    console.log('API Response Status:', response.status);
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
      return { data: { detail: 'Authentication required' }, status: 401, ok: false };
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return { status: response.status, ok: response.ok };
    }

    const data = await response.json();
    
    // Log the response for debugging
    console.log('API Response Data:', data);
    
    return { data, status: response.status, ok: response.ok };
    
  } catch (err) {
    console.error('API Error:', err);
    return { 
      data: { detail: 'Network error: Unable to connect to server' }, 
      status: 0, 
      ok: false 
    };
  }
};

// Helper function for file uploads
export const apiFileUpload = async (endpoint, formData) => {
  const token = localStorage.getItem('token');
  
  try {
    console.log('File Upload API Call:', `${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData - let browser set it with boundary
      },
      body: formData,
    });

    console.log('File Upload Response Status:', response.status);
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
      return { data: { detail: 'Authentication required' }, status: 401, ok: false };
    }

    const data = await response.json();
    console.log('File Upload Response Data:', data);
    
    return { data, status: response.status, ok: response.ok };
    
  } catch (err) {
    console.error('File Upload API Error:', err);
    return { 
      data: { detail: 'Network error: Unable to connect to server' }, 
      status: 0, 
      ok: false 
    };
  }
};

// Auth API calls
export const authAPI = {
  login: (credentials) => apiCall('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  logout: () => apiCall('/auth/logout/', {
    method: 'POST',
  }),
  register: (userData) => apiCall('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  getCurrentUser: () => apiCall('/auth/employees/me/'),
  
  // 2FA Methods
  updateProfile: (data) => apiCall('/auth/employees/update_profile/', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  twoFactorSetup: () => apiCall('/auth/employees/two_factor_setup/'),
  verify2FA: (token) => apiCall('/auth/employees/two_factor_verify/', {
    method: 'POST',
    body: JSON.stringify({ token }),
  }),
  disable2FA: (token) => apiCall('/auth/employees/two_factor_disable/', {
    method: 'POST',
    body: JSON.stringify({ token }),
  }),
};

// Customer API calls
export const customerAPI = {
  getAll: () => apiCall('/customers/customers/'),
  getMyCustomers: () => apiCall('/customers/customers/my_customers/'),
  create: (customerData) => apiCall('/customers/customers/', {
    method: 'POST',
    body: JSON.stringify(customerData),
  }),
  update: (id, customerData) => apiCall(`/customers/customers/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(customerData),
  }),
  delete: (id) => apiCall(`/customers/customers/${id}/`, {
    method: 'DELETE',
  }),
};

// Interaction API calls
export const interactionAPI = {
  getAll: () => apiCall('/interactions/interactions/'),
  create: (interactionData) => apiCall('/interactions/interactions/', {
    method: 'POST',
    body: JSON.stringify(interactionData),
  }),
};

// Collaboration API calls
export const collaborationAPI = {
  // Channels
  getChannels: () => apiCall('/auth/channels/'),
  createChannel: (data) => apiCall('/auth/channels/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Channel Discovery
  discoverChannels: () => apiCall('/auth/channels/discover/'),
  joinChannel: (channelId) => apiCall(`/auth/channels/${channelId}/join/`, {
    method: 'POST',
  }),
  leaveChannel: (channelId) => apiCall(`/auth/channels/${channelId}/leave/`, {
    method: 'POST',
  }),
  getChannelMembers: (channelId) => apiCall(`/auth/channels/${channelId}/members/`),
  
  // Messages
  getChannelMessages: (channelId) => apiCall(`/auth/messages/?channel_id=${channelId}`),
  sendMessage: (data) => apiCall('/auth/messages/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Notes
  getNotes: () => apiCall('/auth/notes/'),
  createNote: (data) => apiCall('/auth/notes/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  deleteNote: (id) => apiCall(`/auth/notes/${id}/`, {
    method: 'DELETE',
  }),
  
  // Activities
  getActivities: () => apiCall('/auth/activities/'),
};

// Project Managers API calls
export const projectManagersAPI = {
  // Meter Issues
  getAllInteractions: () => apiCall('/project-managers/interactions/'),
  getAllMeterIssues: () => apiCall('/project-managers/meter-issues/'),
  getMyMeterIssues: () => apiCall('/project-managers/meter-issues/my_issues/'),
  createMeterIssue: (issueData) => apiCall('/project-managers/meter-issues/', {
    method: 'POST',
    body: JSON.stringify(issueData),
  }),
  updateMeterIssue: (id, issueData) => apiCall(`/project-managers/meter-issues/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(issueData),
  }),
  deleteMeterIssue: (id) => apiCall(`/project-managers/meter-issues/${id}/`, {
    method: 'DELETE',
  }),
  
  // Meter Issue Actions
  updateIssueStatus: (id, status, notes = '') => apiCall(`/project-managers/meter-issues/${id}/update_status/`, {
    method: 'POST',
    body: JSON.stringify({ status, notes }),
  }),
  assignTechnician: (id, technicianId, appointmentTime = null, notes = '') => apiCall(`/project-managers/meter-issues/${id}/assign_technician/`, {
    method: 'POST',
    body: JSON.stringify({ 
      technician_id: technicianId, 
      appointment_time: appointmentTime,
      notes 
    }),
  }),

  // Fetch all available technicians
  getAvailableTechnicians: () => apiCall('/project-managers/technicians/available/'),

  addCustomerFeedback: (id, feedback, rating = null) => apiCall(`/project-managers/meter-issues/${id}/add_feedback/`, {
    method: 'POST',
    body: JSON.stringify({ feedback, rating }),
  }),
  
  // Issue Updates
  getIssueUpdates: (issueId) => apiCall(`/project-managers/meter-issues/${issueId}/updates/`),
  
  // Technician Assignments
  getTechnicianAssignments: (issueId) => apiCall(`/project-managers/meter-issues/${issueId}/assignments/`),
  
  // Customer Feedback
  getCustomerFeedbacks: () => apiCall('/project-managers/customer-feedbacks/'),
  
  // Project Officer Interactions
  recordInteraction: (interactionData) => apiCall('/project-managers/interactions/', {
    method: 'POST',
    body: JSON.stringify(interactionData),
  }),
  getMyInteractions: () => apiCall('/project-managers/interactions/my_interactions/'),
  getAllInteractions: () => apiCall('/project-managers/interactions/'),
  updateInteraction: (id, interactionData) => apiCall(`/project-managers/interactions/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(interactionData),
  }),
  deleteInteraction: (id) => apiCall(`/project-managers/interactions/${id}/`, {
    method: 'DELETE',
  }),
};

// Document Reports API calls - FIXED VERSION
export const documentReportsAPI = {
  // Get all document reports (admin sees all, users see only their own)
  getAll: () => apiCall('/reports/document-reports/'),
  
  // Get current user's document reports
  getMyReports: () => apiCall('/reports/document-reports/my_reports/'),
  
  // Create a new document report (file upload)
  create: (formData) => apiFileUpload('/reports/document-reports/', formData),
  
  // Get a specific report
  get: (id) => apiCall(`/reports/document-reports/${id}/`),
  
  // Update a report
  update: (id, reportData) => apiCall(`/reports/document-reports/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(reportData),
  }),
  
  // Delete a report
  delete: (id) => apiCall(`/reports/document-reports/${id}/`, {
    method: 'DELETE',
  }),
  
  // Submit a report for weekly email
  submit: (id) => apiCall(`/reports/document-reports/${id}/submit/`, {
    method: 'POST',
  }),
  
  // Download document file - FIXED: No auth, no URL manipulation
  downloadDocument: (fileUrl) => {
    // Media files are publicly accessible, no auth needed
    // fileUrl is already an absolute URL from the serializer
    console.log('📥 Downloading from:', fileUrl);
    
    return fetch(fileUrl, {
      method: 'GET',
      // NO Authorization header - media files should be public
      // NO API_BASE_URL prepending - fileUrl is already absolute
    });
  },
};

// Admin API calls
export const adminAPI = {
  getEmployees: () => apiCall('/auth/employees/'),
  createEmployee: (employeeData) => apiCall('/auth/employees/', {
    method: 'POST',
    body: JSON.stringify(employeeData),
  }),
  deleteEmployee: (id) => apiCall(`/auth/employees/${id}/`, {
    method: 'DELETE',
  }),
  resetPassword: (id, passwordData) => apiCall(`/auth/employees/${id}/reset_password/`, {
    method: 'POST',
    body: JSON.stringify(passwordData),
  }),
  getAuditLogs: () => apiCall('/auth/audit-logs/'),
  getCustomerReport: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/reports/reports/customer_report/?${queryString}`);
  },
  getEmployeeActivityReport: () => apiCall('/reports/reports/employee_activity_report/'),
  
  // Project Managers Admin Dashboard
  getPerformanceMetrics: (timeRange = '30') => apiCall(`/project-managers/admin-dashboard/performance_metrics/?time_range=${timeRange}`),
  getCommonIssues: () => apiCall('/project-managers/admin-dashboard/common_issues/'),
  getAffectedAreas: () => apiCall('/project-managers/admin-dashboard/affected_areas/'),
  
  // Project Officer Interactions (Admin view)
  getAllProjectOfficerInteractions: () => apiCall('/project-managers/interactions/'),
  getProjectOfficerInteractionStats: (timeRange = '30') => apiCall(`/project-managers/admin-dashboard/interaction_stats/?time_range=${timeRange}`),
  
  // Public Feedback Management
  getPublicFeedback: (params = '') => apiCall(`/auth/public-feedback/${params}`),
  updateFeedbackStatus: (id, statusData) => apiCall(`/auth/public-feedback/${id}/update_status/`, {
    method: 'POST',
    body: JSON.stringify(statusData),
  }),
  assignFeedback: (id, employeeId) => apiCall(`/auth/public-feedback/${id}/assign/`, {
    method: 'POST',
    body: JSON.stringify({ employee_id: employeeId }),
  }),
  deleteFeedback: (id) => apiCall(`/auth/public-feedback/${id}/`, {
    method: 'DELETE',
  }),

  // Admin Document Reports Management
  sendWeeklyDocumentReports: () => apiCall('/reports/admin-document-reports/send_weekly_reports/', {
    method: 'POST',
  }),
};

// Combined API object for easy imports
export const api = {
  auth: authAPI,
  customers: customerAPI,
  interactions: interactionAPI,
  collaboration: collaborationAPI,
  projectManagers: projectManagersAPI,
  documentReports: documentReportsAPI,
  admin: adminAPI,
};

export default api;