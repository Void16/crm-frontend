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
      // Don't redirect on login endpoint — just return the error
      // so the Login component can display the "Invalid credentials" message
      const isLoginEndpoint = endpoint.includes('/auth/login/');

      if (!isLoginEndpoint) {
        // Expired/invalid session on a protected endpoint — clear and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }

      const data = await response.json().catch(() => ({ error: 'Authentication required' }));
      return { data, status: 401, ok: false };
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
      const isLoginEndpoint = endpoint.includes('/auth/login/');

      if (!isLoginEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }

      const data = await response.json().catch(() => ({ error: 'Authentication required' }));
      return { data, status: 401, ok: false };
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

// Helper function for multipart form data (JSON + files)
export const apiMultipart = async (endpoint, data, fileFields = []) => {
  const token = localStorage.getItem('token');
  
  try {
    console.log('Multipart API Call:', `${API_BASE_URL}${endpoint}`);
    
    const formData = new FormData();
    
    // Add all regular fields
    Object.keys(data).forEach(key => {
      if (fileFields.includes(key)) {
        // Handle file fields
        if (data[key] instanceof File || data[key] instanceof Blob) {
          formData.append(key, data[key]);
        } else if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      } else {
        // Handle non-file fields
        if (data[key] !== null && data[key] !== undefined) {
          if (typeof data[key] === 'object') {
            formData.append(key, JSON.stringify(data[key]));
          } else {
            formData.append(key, data[key]);
          }
        }
      }
    });
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    console.log('Multipart Response Status:', response.status);
    
    if (response.status === 401) {
      const isLoginEndpoint = endpoint.includes('/auth/login/');

      if (!isLoginEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }

      const responseData = await response.json().catch(() => ({ error: 'Authentication required' }));
      return { data: responseData, status: 401, ok: false };
    }

    const responseData = await response.json();
    console.log('Multipart Response Data:', responseData);
    
    return { data: responseData, status: response.status, ok: response.ok };
    
  } catch (err) {
    console.error('Multipart API Error:', err);
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
  technicianRegister: (userData) => apiCall('/auth/register/', {
    method: 'POST',
    body: JSON.stringify({
      ...userData,
      user_type: 'technician',
    }),
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
  updateInteraction: (id, interactionData) => apiCall(`/project-managers/interactions/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(interactionData),
  }),
  deleteInteraction: (id) => apiCall(`/project-managers/interactions/${id}/`, {
    method: 'DELETE',
  }),
};

// Technician API calls
export const technicianAPI = {
  // Job Cards
  getMyJobCards: () => apiCall('/auth/jobcards/my_jobs/'),
  getAvailableJobs: () => apiCall('/auth/jobcards/available_jobs/'),
  getJobCard: (id) => apiCall(`/auth/jobcards/${id}/`),
  createJobCard: (jobCardData) => apiMultipart('/auth/jobcards/', jobCardData, ['before_photos', 'after_photos']),
  updateJobCard: (id, jobCardData) => apiCall(`/auth/jobcards/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(jobCardData),
  }),
  deleteJobCard: (id) => apiCall(`/auth/jobcards/${id}/`, {
    method: 'DELETE',
  }),
  
  // Job Card Actions
  assignToMe: (id) => apiCall(`/auth/jobcards/${id}/assign_to_me/`, {
    method: 'POST',
  }),
  startJob: (id) => apiCall(`/auth/jobcards/${id}/start_job/`, {
    method: 'POST',
  }),
  completeJob: (id, completionData) => apiMultipart(`/auth/jobcards/${id}/complete_job/`, completionData, 
    ['customer_signature', 'technician_signature', 'after_photos']),
  updateJobStatus: (id, status) => apiCall(`/auth/jobcards/${id}/update_status/`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  }),
  
  // Photos
  uploadBeforePhoto: (id, photoFile) => {
    const formData = new FormData();
    formData.append('type', 'before');
    formData.append('photo', photoFile);
    return apiFileUpload(`/auth/jobcards/${id}/upload_photos/`, formData);
  },
  uploadAfterPhoto: (id, photoFile) => {
    const formData = new FormData();
    formData.append('type', 'after');
    formData.append('photo', photoFile);
    return apiFileUpload(`/auth/jobcards/${id}/upload_photos/`, formData);
  },
  
  // Signatures
  uploadCustomerSignature: (id, signatureData) => apiCall(`/auth/jobcards/${id}/upload_signature/`, {
    method: 'POST',
    body: JSON.stringify({ 
      type: 'customer',
      signature: signatureData 
    }),
  }),
  uploadTechnicianSignature: (id, signatureData) => apiCall(`/auth/jobcards/${id}/upload_signature/`, {
    method: 'POST',
    body: JSON.stringify({ 
      type: 'technician',
      signature: signatureData 
    }),
  }),
  
  // Materials
  addMaterialUsage: (id, materialData) => apiCall(`/auth/jobcards/${id}/add_material/`, {
    method: 'POST',
    body: JSON.stringify(materialData),
  }),
  getMaterialUsage: (id) => apiCall(`/auth/jobcards/${id}/materials_used/`),
  
  // History
  getJobCardHistory: (id) => apiCall(`/auth/jobcards/${id}/history/`),
  
  // Schedule
  getMySchedule: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    return apiCall(`/auth/schedule/my_schedule/?${params}`);
  },
  createScheduleEntry: (scheduleData) => apiCall('/auth/schedule/', {
    method: 'POST',
    body: JSON.stringify(scheduleData),
  }),
  updateScheduleEntry: (id, scheduleData) => apiCall(`/auth/schedule/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(scheduleData),
  }),
  deleteScheduleEntry: (id) => apiCall(`/auth/schedule/${id}/`, {
    method: 'DELETE',
  }),
  
  // Inventory
  getMyInventory: () => apiCall('/auth/inventory/my_inventory/'),
  updateInventoryItem: (id, quantity) => apiCall(`/auth/inventory/${id}/update_quantity/`, {
    method: 'POST',
    body: JSON.stringify({ quantity }),
  }),
  requestMaterial: (materialData) => apiCall('/auth/inventory/request_material/', {
    method: 'POST',
    body: JSON.stringify(materialData),
  }),
  
  // Reports
  generateJobReport: (id) => apiCall(`/auth/jobcards/${id}/generate_report/`),
  getDailyReport: (date) => {
    const params = new URLSearchParams({ date: date || new Date().toISOString().split('T')[0] });
    return apiCall(`/auth/reports/daily/?${params}`);
  },
  getWeeklyReport: (weekStart) => {
    const params = new URLSearchParams();
    if (weekStart) params.append('week_start', weekStart);
    return apiCall(`/auth/reports/weekly/?${params}`);
  },
  
  // Technician Profile
  updateTechnicianProfile: (data) => apiCall('/auth/technicians/me/', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  setAvailability: (isAvailable) => apiCall('/auth/technicians/set_availability/', {
    method: 'POST',
    body: JSON.stringify({ is_available: isAvailable }),
  }),
  
  // Statistics
  getTechnicianStats: (timeRange = '30') => apiCall(`/auth/technicians/stats/?time_range=${timeRange}`),
};

// Technician Admin API calls (for admin users)
export const technicianAdminAPI = {
  // Technicians Management
  getAllTechnicians: () => apiCall('/auth/technicians/'),
  createTechnician: (technicianData) => apiCall('/auth/technicians/', {
    method: 'POST',
    body: JSON.stringify(technicianData),
  }),
  updateTechnician: (id, technicianData) => apiCall(`/auth/technicians/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(technicianData),
  }),
  deleteTechnician: (id) => apiCall(`/auth/technicians/${id}/`, {
    method: 'DELETE',
  }),
  
  // All Job Cards (Admin view)
  getAllJobCards: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/auth/jobcards/?${queryString}`);
  },
  
  // Assign Job Cards
  assignJobCard: (jobCardId, technicianId) => apiCall(`/auth/jobcards/${jobCardId}/assign/`, {
    method: 'POST',
    body: JSON.stringify({ technician_id: technicianId }),
  }),
  
  // Technician Performance
  getTechnicianPerformance: (technicianId, timeRange = '30') => 
    apiCall(`/auth/technicians/${technicianId}/performance/?time_range=${timeRange}`),
  getAllTechniciansPerformance: (timeRange = '30') => 
    apiCall(`/auth/technicians/performance/?time_range=${timeRange}`),
  
  // Technician Schedule (Admin view)
  getAllSchedules: (date) => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    return apiCall(`/auth/schedule/?${params}`);
  },
  
  // Inventory Management (Admin)
  getAllInventory: () => apiCall('/auth/inventory/'),
  createInventoryItem: (itemData) => apiCall('/auth/inventory/', {
    method: 'POST',
    body: JSON.stringify(itemData),
  }),
  updateInventoryItem: (id, itemData) => apiCall(`/auth/inventory/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(itemData),
  }),
  deleteInventoryItem: (id) => apiCall(`/auth/inventory/${id}/`, {
    method: 'DELETE',
  }),
  
  // Service Reports
  getAllServiceReports: () => apiCall('/auth/service-reports/'),
  generateServiceReport: (reportData) => apiCall('/auth/service-reports/generate/', {
    method: 'POST',
    body: JSON.stringify(reportData),
  }),
  getServiceReport: (id) => apiCall(`/auth/service-reports/${id}/`),
  
  // Technician Analytics
  getJobTypeAnalytics: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    return apiCall(`/auth/analytics/job_types/?${params}`);
  },
  getRevenueAnalytics: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    return apiCall(`/auth/analytics/revenue/?${params}`);
  },
};

// Document Reports API calls
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
  
  // Download document file - Media files are publicly accessible, no auth needed
  downloadDocument: (fileUrl) => {
    console.log('📥 Downloading from:', fileUrl);
    return fetch(fileUrl, {
      method: 'GET',
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

  // Technician Admin Functions
  ...technicianAdminAPI,
};

// Customer Meter Verification API
export const meterVerificationAPI = {
  verify: (meterNumber) => apiCall('/auth/customer-meters/verify/', {
    method: 'POST',
    body: JSON.stringify({ meter_number: meterNumber }),
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
  technician: technicianAPI,
  technicianAdmin: technicianAdminAPI,
  meterVerification: meterVerificationAPI,
};

export default api;