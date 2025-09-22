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
};