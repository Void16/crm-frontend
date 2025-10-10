import React, { useState, useEffect } from 'react';
import { 
  Users, MessageSquare, Plus, User, Settings, 
  BarChart3, FileText, LogOut, Building2, Menu, X,
  AlertTriangle, Wrench, CheckCircle, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { customerAPI, interactionAPI, adminAPI, projectManagersAPI, api } from '../services/api';
import CustomerForm from '../components/customers/CustomerForm';
import InteractionForm from '../components/interactions/InteractionForm';
import EmployeeForm from '../components/employees/EmployeeForm';
import AllCustomersList from '../components/customers/AllCustomersList';
import MyCustomersList from '../components/customers/MyCustomersList';
import InteractionsList from '../components/interactions/InteractionsList';
import EmployeesList from '../components/employees/EmployeesList';
import Reports from '../components/reports/Reports';
import AuditLogs from '../components/audit/AuditLogs';
import Notification from '../components/common/Notification';

// Project Officer Components
import MeterIssueForm from '../components/project-officer/MeterIssueForm';
import MeterIssuesList from '../components/project-officer/MeterIssuesList';
import TechnicianAssignment from '../components/project-officer/TechnicianAssignment';
import CustomerFeedbackForm from '../components/project-officer/CustomerFeedbackForm';

// Admin Project Management Components
import AdminMeterIssues from '../components/admin/AdminMeterIssues';
import PerformanceMetrics from '../components/admin/PerformanceMetrics';

const Dashboard = ({ user, onLogout }) => {
  // Determine default tab based on user role
  const getDefaultTab = () => {
    switch(user?.user_type) {
      case 'admin': return 'customers';
      case 'project_officer': return 'meter-issues';
      default: return 'my-customers';
    }
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab());
  const [customers, setCustomers] = useState([]);
  const [myCustomers, setMyCustomers] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  
  // Project Officer States
  const [meterIssues, setMeterIssues] = useState([]);
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Modals
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showMeterIssueModal, setShowMeterIssueModal] = useState(false);
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  
  // Form states
  const [customerForm, setCustomerForm] = useState({ 
    name: '', email: '', phone: '', company: '', title: '' 
  });
  const [interactionForm, setInteractionForm] = useState({ 
    customer: '', notes: '' 
  });
  const [employeeForm, setEmployeeForm] = useState({ 
    username: '', password: '', first_name: '', last_name: '', 
    email: '', user_type: 'employee' 
  });
  
  // Meter Issue Form State
  const [meterIssueForm, setMeterIssueForm] = useState({
    meter_id: '',
    customer_name: '',
    customer_location: '',
    issue_type: '',
    severity_level: 'medium',
    description: '',
    evidence_image: null
  });
  
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

 const fetchData = async () => {
  if (!user) return;
  
  setLoading(true);
  setError(''); // Clear previous errors
  
  try {
    console.log('🔄 Starting data fetch for:', user.user_type);

    // Use Promise.allSettled to handle all API calls independently
    const promises = [];

    // Always fetch these for all users
    promises.push(
      customerAPI.getMyCustomers().then(result => {
        if (result?.ok) {
          setMyCustomers(result.data);
          console.log('✅ My customers loaded');
        }
        return result;
      }).catch(err => {
        console.warn('⚠️ Failed to fetch my customers:', err);
        return null;
      })
    );

    promises.push(
      interactionAPI.getAll().then(result => {
        if (result?.ok) {
          setInteractions(result.data);
          console.log('✅ Interactions loaded');
        }
        return result;
      }).catch(err => {
        console.warn('⚠️ Failed to fetch interactions:', err);
        return null;
      })
    );

    // Admin-specific data
    if (user.user_type === 'admin') {
      promises.push(
        customerAPI.getAll().then(result => {
          if (result?.ok) {
            setCustomers(result.data);
            console.log('✅ All customers loaded');
          }
          return result;
        }).catch(err => {
          console.warn('⚠️ Failed to fetch all customers:', err);
          return null;
        })
      );

      promises.push(
        adminAPI.getEmployees().then(result => {
          if (result?.ok) {
            setEmployees(result.data);
            console.log('✅ Employees loaded');
          }
          return result;
        }).catch(err => {
          console.warn('⚠️ Failed to fetch employees:', err);
          return null;
        })
      );

      promises.push(
        adminAPI.getAuditLogs().then(result => {
          if (result?.ok) {
            setAuditLogs(result.data);
            console.log('✅ Audit logs loaded');
          }
          return result;
        }).catch(err => {
          console.warn('⚠️ Failed to fetch audit logs:', err);
          return null;
        })
      );

      // Project management data for admin - handle these separately since they might fail
      promises.push(
        projectManagersAPI.getAllMeterIssues().then(result => {
          if (result?.ok) {
            setMeterIssues(result.data);
            console.log('✅ All meter issues loaded');
          } else {
            console.warn('⚠️ Failed to fetch all meter issues:', result);
          }
          return result;
        }).catch(err => {
          console.warn('⚠️ Failed to fetch all meter issues:', err);
          return null;
        })
      );

      promises.push(
  api.admin.getPerformanceMetrics()
    .then(result => {
      if (result?.ok) {
        console.log('✅ Performance metrics loaded', result.data);

        // Corrected: use performance_data array from backend response
        setPerformanceData(result.data.performance_data || []);

        // Optional: if you want these later
        //setCommonIssues(result.data.common_issues || []);
        //setAffectedAreas(result.data.affected_areas || []);
      } else {
        console.warn('⚠️ Failed to fetch performance metrics:', result);
      }
      return result;
    })
    .catch(err => {
      console.warn('⚠️ Failed to fetch performance metrics:', err);
      return null;
    })
);

    }

    // Project officer data
    if (user.user_type === 'project_officer') {
      promises.push(
        projectManagersAPI.getMyMeterIssues().then(result => {
          if (result?.ok) {
            setAssignedIssues(result.data);
            console.log('✅ My issues loaded');
          } else {
            console.warn('⚠️ Failed to fetch my issues:', result);
          }
          return result;
        }).catch(err => {
          console.warn('⚠️ Failed to fetch my issues:', err);
          return null;
        })
      );

      promises.push(
        projectManagersAPI.getAvailableTechnicians().then(result => {
          if (result?.ok) {
            setTechnicians(result.data);
            console.log('✅ Technicians loaded');
          } else {
            console.warn('⚠️ Failed to fetch technicians:', result);
          }
          return result;
        }).catch(err => {
          console.warn('⚠️ Failed to fetch technicians:', err);
          return null;
        })
      );
    }

    // Wait for all API calls to complete (success or failure)
    await Promise.all(promises);
    console.log('🎉 All data fetch operations completed');

  } catch (err) {
    // This should only catch critical errors, not individual API failures
    console.error('💥 Critical error in fetchData:', err);
    setError('Failed to fetch some data. Please refresh the page.');
  } finally {
    setLoading(false);
  }
};

  // Project Officer Functions
  const reportMeterIssue = async () => {
  setLoading(true);
  setError('');
  
  try {
    console.log('Sending meter issue data:', meterIssueForm);
    
    const result = await projectManagersAPI.createMeterIssue(meterIssueForm);
    
    console.log('API Response:', result);
    
    if (result?.ok) {
      setSuccess('Meter issue reported successfully!');
      setShowMeterIssueModal(false);
      setMeterIssueForm({
        meter_id: '',
        customer_name: '',
        customer_location: '',
        issue_type: '',
        severity_level: 'medium',
        description: '',
        evidence_image: null // CHANGE THIS TOO
      });
      fetchData();
    } else {
      const errorMsg = result?.data?.detail || 
                      result?.data?.message || 
                      Object.values(result?.data || {}).flat().join(', ') ||
                      'Failed to report meter issue';
      setError(errorMsg);
    }
  } catch (err) {
    console.error('Network error:', err);
    setError('Network error: Failed to connect to server');
  } finally {
    setLoading(false);
  }
};

  const assignTechnician = async (issueId, technicianId, appointmentTime) => {
    setLoading(true);
    setError('');
    
    const result = await projectManagersAPI.assignTechnician(issueId, {
      technician_id: technicianId,
      appointment_time: appointmentTime
    });
    
    if (result?.ok) {
      setSuccess('Technician assigned successfully!');
      setShowTechnicianModal(false);
      setSelectedIssue(null);
      fetchData();
    } else {
      setError('Failed to assign technician');
    }
    
    setLoading(false);
  };
  //to delete admin
  const updateIssueStatus = async (issueId, status, resolutionNotes = '') => {
  setLoading(true);
  setError('');
  
  try {
    const result = await projectManagersAPI.updateIssueStatus(issueId, {
      status,
      resolution_notes: resolutionNotes
    });
    
    if (result?.ok) {
      setSuccess('Issue status updated successfully!');
      fetchData();
    } else {
      setError('Failed to update issue status');
    }
  } catch (err) {
    console.error('Error updating issue status:', err);
    setError('Failed to update issue status');
  } finally {
    setLoading(false);
  }
};//up to here 
  const submitCustomerFeedback = async (issueId, rating, comments = '') => {
    setLoading(true);
    setError('');
    
    const result = await projectManagersAPI.submitFeedback(issueId, {
      satisfaction_rating: rating,
      comments
    });
    
    if (result?.ok) {
      setSuccess('Feedback submitted successfully!');
      setShowFeedbackModal(false);
      setSelectedIssue(null);
      fetchData();
    } else {
      setError('Failed to submit feedback');
    }
    
    setLoading(false);
  };

  // Existing functions (createCustomer, updateCustomer, etc.) remain the same...
  const createCustomer = async () => {
    setLoading(true);
    setError('');
    
    const result = await customerAPI.create(customerForm);
    
    if (result?.ok) {
      setSuccess('Customer created successfully!');
      setShowCustomerModal(false);
      setCustomerForm({ name: '', email: '', phone: '', company: '', title: '' });
      fetchData();
    } else if (result?.data?.email) {
      setError(result.data.email[0]);
    } else {
      setError('Failed to create customer');
    }
    
    setLoading(false);
  };

  const updateCustomer = async () => {
    setLoading(true);
    setError('');
    
    const result = await customerAPI.update(editingCustomer.id, customerForm);
    
    if (result?.ok) {
      setSuccess('Customer updated successfully!');
      setShowCustomerModal(false);
      setEditingCustomer(null);
      setCustomerForm({ name: '', email: '', phone: '', company: '', title: '' });
      fetchData();
    } else {
      setError('Failed to update customer');
    }
    
    setLoading(false);
  };

  const deleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      const result = await customerAPI.delete(id);
      
      if (result?.status === 204) {
        setSuccess('Customer deleted successfully!');
        fetchData();
      } else {
        setError('Failed to delete customer');
      }
    }
  };

  const createInteraction = async () => {
    setLoading(true);
    setError('');
    
    const result = await interactionAPI.create({
      customer: parseInt(interactionForm.customer),
      notes: interactionForm.notes,
    });
    
    if (result?.ok) {
      setSuccess('Interaction added successfully!');
      setShowInteractionModal(false);
      setInteractionForm({ customer: '', notes: '' });
      fetchData();
    } else {
      setError('Failed to create interaction');
    }
    
    setLoading(false);
  };

  const createEmployee = async () => {
    setLoading(true);
    setError('');
    
    const result = await adminAPI.createEmployee(employeeForm);
    
    if (result?.ok) {
      setSuccess('Employee created successfully!');
      setShowEmployeeModal(false);
      setEmployeeForm({ 
        username: '', password: '', first_name: '', last_name: '', 
        email: '', user_type: 'employee' 
      });
      fetchData();
    } else {
      setError('Failed to create employee');
    }
    
    setLoading(false);
  };

  const resetPassword = async (employeeId, newPassword) => {
    setLoading(true);
    setError('');
    
    const result = await adminAPI.resetPassword(employeeId, { new_password: newPassword });
    
    if (result?.ok) {
      setSuccess('Password reset successfully!');
    } else {
      setError('Failed to reset password');
    }
    
    setLoading(false);
  };

  const deleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      const result = await adminAPI.deleteEmployee(id);
      
      if (result?.status === 204) {
        setSuccess('Employee deleted successfully!');
        fetchData();
      } else {
        setError('Failed to delete employee');
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    if (success) {
      setTimeout(() => setSuccess(''), 3000);
    }
    if (error) {
      setTimeout(() => setError(''), 3000);
    }
  }, [success, error]);

  const handleAddInteraction = (customer) => {
    setSelectedCustomer(customer);
    setInteractionForm({...interactionForm, customer: customer.id});
    setShowInteractionModal(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setCustomerForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      title: customer.title
    });
    setShowCustomerModal(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  // Define tabs based on user type
  const getTabItems = () => {
    const baseTabs = [
      { id: 'my-customers', label: 'My Customers', icon: User },
      { id: 'interactions', label: 'Interactions', icon: MessageSquare },
    ];

    const projectOfficerTabs = [
      { id: 'meter-issues', label: 'Meter Issues', icon: AlertTriangle },
      { id: 'assigned-issues', label: 'My Assigned Issues', icon: Wrench },
    ];

    const adminTabs = [
      { id: 'customers', label: 'All Customers', icon: Users },
      ...baseTabs,
      { id: 'employees', label: 'Employees', icon: Settings },
      { id: 'project-management', label: 'Project Management', icon: Building2 },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
      { id: 'audit', label: 'Audit Logs', icon: FileText }
    ];

    switch(user?.user_type) {
      case 'admin':
        return adminTabs;
      case 'project_officer':
        return projectOfficerTabs;
      default:
        return baseTabs;
    }
  };

  const tabItems = getTabItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Same as before */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              <img 
                src="/bi.ico" 
                alt="BI Logo" 
                className="h-8 w-8 sm:h-12 sm:w-12 mr-2 sm:mr-3" 
              />
              <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                <span className="hidden sm:inline">CRM BI Solutions</span>
                <span className="sm:hidden">CRM BI</span>
              </h1>
            </div>

            {/* Desktop User Info and Logout */}
            <div className="hidden sm:flex items-center space-x-4">
              <button
                onClick={handleProfileClick}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <User className="h-4 w-4 mr-1" />
                <span className="hidden lg:inline">Profile</span>
              </button>
              
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">{user?.first_name} {user?.last_name}</span>
                <span className="md:hidden">{user?.first_name}</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {user?.user_type}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-600" />
                <span className="text-sm text-gray-600">{user?.first_name} {user?.last_name}</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {user?.user_type}
                </span>
              </div>
            </div>
            <div className="py-2">
              <button
                onClick={() => {
                  handleProfileClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <User className="inline h-4 w-4 mr-3" />
                My Profile
              </button>
              
              {tabItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="inline h-4 w-4 mr-3" />
                  {tab.label}
                </button>
              ))}
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-200 flex items-center"
              >
                <LogOut className="inline h-4 w-4 mr-3" />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Notifications */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {success && (
          <Notification type="success" message={success} onClose={() => setSuccess('')} />
        )}
        {error && (
          <Notification type="error" message={error} onClose={() => setError('')} />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Desktop Navigation Tabs */}
        <div className="hidden sm:block border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-4 lg:space-x-8 overflow-x-auto">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex-shrink-0 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="inline h-4 w-4 mr-1" />
                <span className="hidden lg:inline">{tab.label}</span>
                <span className="lg:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {/* All Customers Tab (Admin Only) */}
          {activeTab === 'customers' && user?.user_type === 'admin' && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h2 className="text-lg font-medium text-gray-900">All Customers</h2>
                <button
                  onClick={() => setShowCustomerModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center w-full sm:w-auto transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Customer
                </button>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading customers...</span>
                </div>
              ) : customers.length > 0 ? (
                <AllCustomersList
                  customers={customers}
                  user={user}
                  onAddInteraction={handleAddInteraction}
                  onEditCustomer={handleEditCustomer}
                  onDeleteCustomer={deleteCustomer}
                />
              ) : (
                <p className="text-gray-500 text-center py-8">No customers found.</p>
              )}
            </div>
          )}

          {/* My Customers Tab (Both Admin and Employee) */}
          {activeTab === 'my-customers' && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {user?.user_type === 'admin' ? 'My Assigned Customers' : 'My Customers'}
                </h2>
                <button
                  onClick={() => {
                    setEditingCustomer(null);
                    setCustomerForm({ name: '', email: '', phone: '', company: '', title: '' });
                    setShowCustomerModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center w-full sm:w-auto transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Customer
                </button>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading customers...</span>
                </div>
              ) : myCustomers.length > 0 ? (
                <MyCustomersList
                  customers={myCustomers}
                  onAddInteraction={handleAddInteraction}
                  onEditCustomer={handleEditCustomer}
                  onAddCustomer={() => {
                    setEditingCustomer(null);
                    setCustomerForm({ name: '', email: '', phone: '', company: '', title: '' });
                    setShowCustomerModal(true);
                  }}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    {user?.user_type === 'admin' ? 'No customers assigned to you.' : 'No customers assigned to you.'}
                  </p>
                  <button
                    onClick={() => {
                      setEditingCustomer(null);
                      setCustomerForm({ name: '', email: '', phone: '', company: '', title: '' });
                      setShowCustomerModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center mx-auto transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Your First Customer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Interactions Tab */}
          {activeTab === 'interactions' && (
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Interactions</h2>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading interactions...</span>
                </div>
              ) : interactions.length > 0 ? (
                <InteractionsList interactions={interactions} />
              ) : (
                <p className="text-gray-500 text-center py-8">No interactions found.</p>
              )}
            </div>
          )}

          {/* Employees Tab (Admin Only) */}
          {activeTab === 'employees' && user?.user_type === 'admin' && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h2 className="text-lg font-medium text-gray-900">Employees</h2>
                <button
                  onClick={() => setShowEmployeeModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center w-full sm:w-auto transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Employee
                </button>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading employees...</span>
                </div>
              ) : employees.length > 0 ? (
                <EmployeesList 
                  employees={employees} 
                  onResetPassword={resetPassword}
                  onDeleteEmployee={deleteEmployee}
                />
              ) : (
                <p className="text-gray-500 text-center py-8">No employees found.</p>
              )}
            </div>
          )}

          {/* Project Management Tab (Admin Only) */}
          {activeTab === 'project-management' && user?.user_type === 'admin' && (
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Project Management</h2>
              <div className="space-y-6">
                {/* Performance Metrics */}
                <PerformanceMetrics 
                  performanceData={performanceData} 
                  loading={loading}
                />
                
                {/* All Meter Issues */}
                <AdminMeterIssues 
                  meterIssues={meterIssues}
                  loading={loading}
                  onRefresh={fetchData}
                />
              </div>
            </div>
          )}

          {/* Meter Issues Tab (Project Officer) */}
          {activeTab === 'meter-issues' && user?.user_type === 'project_officer' && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h2 className="text-lg font-medium text-gray-900">Meter Issues</h2>
                <button
                  onClick={() => setShowMeterIssueModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center w-full sm:w-auto transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Report Issue
                </button>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading meter issues...</span>
                </div>
              ) : assignedIssues.length > 0 ? (
                <MeterIssuesList
                  issues={assignedIssues}
                  onUpdateStatus={updateIssueStatus}
                  onAssignTechnician={(issue) => {
                    setSelectedIssue(issue);
                    setShowTechnicianModal(true);
                  }}
                  onSubmitFeedback={(issue) => {
                    setSelectedIssue(issue);
                    setShowFeedbackModal(true);
                  }}
                />
              ) : (
                <p className="text-gray-500 text-center py-8">No meter issues found.</p>
              )}
            </div>
          )}

          {/* Assigned Issues Tab (Project Officer) */}
          {activeTab === 'assigned-issues' && user?.user_type === 'project_officer' && (
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">My Assigned Issues</h2>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading assigned issues...</span>
                </div>
              ) : assignedIssues.length > 0 ? (
                <MeterIssuesList
                  issues={assignedIssues}
                  onUpdateStatus={updateIssueStatus}
                  onAssignTechnician={(issue) => {
                    setSelectedIssue(issue);
                    setShowTechnicianModal(true);
                  }}
                  onSubmitFeedback={(issue) => {
                    setSelectedIssue(issue);
                    setShowFeedbackModal(true);
                  }}
                />
              ) : (
                <p className="text-gray-500 text-center py-8">No assigned issues found.</p>
              )}
            </div>
          )}

          {/* Reports Tab (Admin Only) */}
          {activeTab === 'reports' && user?.user_type === 'admin' && (
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Reports</h2>
              <Reports />
            </div>
          )}

          {/* Audit Logs Tab (Admin Only) */}
          {activeTab === 'audit' && user?.user_type === 'admin' && (
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Audit Logs</h2>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading audit logs...</span>
                </div>
              ) : auditLogs.length > 0 ? (
                <AuditLogs auditLogs={auditLogs} />
              ) : (
                <p className="text-gray-500 text-center py-8">No audit logs found.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CustomerForm
        show={showCustomerModal}
        onClose={() => {
          setShowCustomerModal(false);
          setEditingCustomer(null);
          setCustomerForm({ name: '', email: '', phone: '', company: '', title: '' });
          setError('');
        }}
        customerForm={customerForm}
        setCustomerForm={setCustomerForm}
        onSubmit={editingCustomer ? updateCustomer : createCustomer}
        editingCustomer={editingCustomer}
        loading={loading}
        error={error}
      />

      <InteractionForm
        show={showInteractionModal}
        onClose={() => {
          setShowInteractionModal(false);
          setInteractionForm({ customer: '', notes: '' });
          setError('');
        }}
        interactionForm={interactionForm}
        setInteractionForm={setInteractionForm}
        onSubmit={createInteraction}
        customers={user?.user_type === 'admin' ? customers : myCustomers}
        loading={loading}
        error={error}
      />

      <EmployeeForm
        show={showEmployeeModal}
        onClose={() => {
          setShowEmployeeModal(false);
          setEmployeeForm({ 
            username: '', password: '', first_name: '', last_name: '', 
            email: '', user_type: 'employee' 
          });
          setError('');
        }}
        employeeForm={employeeForm}
        setEmployeeForm={setEmployeeForm}
        onSubmit={createEmployee}
        loading={loading}
        error={error}
      />

      {/* Project Officer Modals */}
      <MeterIssueForm
        show={showMeterIssueModal}
        onClose={() => {
          setShowMeterIssueModal(false);
          setMeterIssueForm({
            meter_id: '',
            customer_name: '',
            customer_location: '',
            issue_type: '',
            severity_level: 'medium',
            description: '',
            evidence_image: null
          });
          setError('');
        }}
        meterIssueForm={meterIssueForm}
        setMeterIssueForm={setMeterIssueForm}
        onSubmit={reportMeterIssue}
        loading={loading}
        error={error}
      />

      <TechnicianAssignment
        show={showTechnicianModal}
        onClose={() => {
          setShowTechnicianModal(false);
          setSelectedIssue(null);
          setError('');
        }}
        issue={selectedIssue}
        technicians={technicians}
        onAssign={assignTechnician}
        loading={loading}
        error={error}
      />

      <CustomerFeedbackForm
        show={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          setSelectedIssue(null);
          setError('');
        }}
        issue={selectedIssue}
        onSubmit={submitCustomerFeedback}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default Dashboard;