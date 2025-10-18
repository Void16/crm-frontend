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
      return null;
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
    return null;
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
  
  // 2FA Methods - Updated to match your URL structure
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

// Project Managers API calls - FIXED: Changed to projectManagersAPI (with 's')
export const projectManagersAPI = {
  // Meter Issues
  // In your projectManagersAPI object
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
  getAllInteractions: () => apiCall('/project-managers/interactions/'), // For admin view
  updateInteraction: (id, interactionData) => apiCall(`/project-managers/interactions/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(interactionData),
  }),
  deleteInteraction: (id) => apiCall(`/project-managers/interactions/${id}/`, {
    method: 'DELETE',
  }),
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
};

// Combined API object for easy imports
export const api = {
  auth: authAPI,
  customers: customerAPI,
  interactions: interactionAPI,
  projectManagers: projectManagersAPI,
  admin: adminAPI,
};

export default api;