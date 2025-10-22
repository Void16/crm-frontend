import React, { useState, useEffect } from 'react';
import { 
  Users, MessageSquare, Plus, User, Settings, 
  BarChart3, FileText, LogOut, Building2, Menu, X,
  AlertTriangle, Wrench, CheckCircle, Clock, Activity, MessageCircle,
  MapPin, RefreshCw, Globe 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { customerAPI, interactionAPI, adminAPI, projectManagersAPI, api, collaborationAPI } from '../services/api';
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
import AIDashboard from '../components/ai/AIDashboard';
import RealTimeDashboard from '../components/Dashboard/RealTimeDashboard';
import CreateChannelModal from '../components/collaboration/CreateChannelModal';
import ChannelDiscovery from '../components/collaboration/ChannelDiscovery';

// Project Officer Components
import MeterIssueForm from '../components/project-officer/MeterIssueForm';
import MeterIssuesList from '../components/project-officer/MeterIssuesList';
import TechnicianAssignment from '../components/project-officer/TechnicianAssignment';
import CustomerFeedbackForm from '../components/project-officer/CustomerFeedbackForm';
import CustomerFeedbackList from '../components/project-officer/CustomerFeedbackList';
import ProjectOfficerInteractionForm from '../components/project-officer/ProjectOfficerInteractionForm';
import ProjectOfficerInteractionsList from '../components/project-officer/ProjectOfficerInteractionsList';
import AdminInteractionsList from '../components/admin/AdminInteractionsList';

// Admin Project Management Components
import AdminMeterIssues from '../components/admin/AdminMeterIssues';
import PerformanceMetrics from '../components/admin/PerformanceMetrics';

// Collaboration Components
import ActivityFeed from '../components/collaboration/ActivityFeed';
import ChannelList from '../components/collaboration/ChannelList';
import NotesList from '../components/collaboration/NotesList';

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
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  
  // Project Officer States
  const [meterIssues, setMeterIssues] = useState([]);
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [customerFeedbacks, setCustomerFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [projectOfficerInteractions, setProjectOfficerInteractions] = useState([]);
  const [adminInteractions, setAdminInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Collaboration States
  const [activities, setActivities] = useState([]);
  const [channels, setChannels] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [collaborationLoading, setCollaborationLoading] = useState(false);
  
  // Modals
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showMeterIssueModal, setShowMeterIssueModal] = useState(false);
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showProjectOfficerInteractionModal, setShowProjectOfficerInteractionModal] = useState(false);
  
  // Collaboration Modals
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);
  
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
  
  // Collaboration Form States
  const [channelForm, setChannelForm] = useState({
    name: '',
    description: '',
    channel_type: 'general',
    is_private: false
  });
  
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    is_public: false
  });
  
  const [messageForm, setMessageForm] = useState({
    content: '',
    channel: ''
  });

  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  // Collaboration Functions
  const fetchActivities = async () => {
    setCollaborationLoading(true);
    try {
      console.log('🔄 Fetching team activities...');
      const result = await collaborationAPI.getActivities();
      console.log('📨 Activities response:', result);
      
      if (result?.ok) {
        setActivities(result.data);
        console.log(`✅ Loaded ${result.data.length} activity items`);
      } else {
        console.error('❌ Failed to fetch activities:', result);
      }
    } catch (error) {
      console.error('💥 Error fetching activities:', error);
    } finally {
      setCollaborationLoading(false);
    }
  };

  const fetchChannels = async () => {
    setCollaborationLoading(true);
    try {
      console.log('🔄 Fetching channels...');
      const result = await collaborationAPI.getChannels();
      console.log('📨 Channels response:', result);
      
      if (result?.ok) {
        setChannels(result.data);
        console.log(`✅ Loaded ${result.data.length} channels`);
      } else {
        console.error('❌ Failed to fetch channels:', result);
      }
    } catch (error) {
      console.error('💥 Error fetching channels:', error);
    } finally {
      setCollaborationLoading(false);
    }
  };

  const fetchNotes = async () => {
    setCollaborationLoading(true);
    try {
      console.log('🔄 Fetching notes...');
      const result = await collaborationAPI.getNotes();
      console.log('📨 Notes response:', result);
      
      if (result?.ok) {
        setNotes(result.data);
        console.log(`✅ Loaded ${result.data.length} notes`);
      } else {
        console.error('❌ Failed to fetch notes:', result);
      }
    } catch (error) {
      console.error('💥 Error fetching notes:', error);
    } finally {
      setCollaborationLoading(false);
    }
  };

  const fetchChannelMessages = async (channelId) => {
    setCollaborationLoading(true);
    try {
      console.log(`🔄 Fetching messages for channel ${channelId}...`);
      const result = await collaborationAPI.getChannelMessages(channelId);
      console.log('📨 Messages response:', result);
      
      if (result?.ok) {
        setMessages(result.data);
        console.log(`✅ Loaded ${result.data.length} messages`);
      } else {
        console.error('❌ Failed to fetch messages:', result);
      }
    } catch (error) {
      console.error('💥 Error fetching messages:', error);
    } finally {
      setCollaborationLoading(false);
    }
  };

  const createChannel = async (formData) => {
  setLoading(true);
  setError('');
  
  try {
    console.log('🔄 Creating channel with data:', formData);
    const result = await collaborationAPI.createChannel(formData);
    
    if (result?.ok) {
      setSuccess('Channel created successfully!');
      setShowCreateChannelModal(false);
      fetchChannels(); // Refresh the channels list
    } else {
      console.error('❌ Failed to create channel - Server response:', result.data);
      
      // Extract specific error messages
      let errorMessage = 'Failed to create channel';
      if (result?.data) {
        if (result.data.detail) {
          errorMessage = result.data.detail;
        } else if (result.data.name) {
          errorMessage = `Name: ${result.data.name.join(', ')}`;
        } else if (result.data.channel_type) {
          errorMessage = `Channel Type: ${result.data.channel_type.join(', ')}`;
        } else if (typeof result.data === 'string') {
          errorMessage = result.data;
        } else {
          errorMessage = JSON.stringify(result.data);
        }
      }
      setError(errorMessage);
    }
  } catch (err) {
    console.error('💥 Error creating channel:', err);
    setError('Network error: Failed to create channel');
  } finally {
    setLoading(false);
  }
};

  const createNote = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔄 Creating note:', noteForm);
      const result = await collaborationAPI.createNote(noteForm);
      
      if (result?.ok) {
        setSuccess('Note created successfully!');
        setShowCreateNoteModal(false);
        setNoteForm({ title: '', content: '', is_public: false });
        fetchNotes();
      } else {
        setError('Failed to create note');
      }
    } catch (err) {
      console.error('💥 Error creating note:', err);
      setError('Network error: Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageForm.content.trim() || !selectedChannel) return;
    
    setLoading(true);
    setError('');
    
    try {
      const messageData = {
        content: messageForm.content,
        channel: selectedChannel.id
      };
      
      console.log('🔄 Sending message:', messageData);
      const result = await collaborationAPI.sendMessage(messageData);
      
      if (result?.ok) {
        setMessageForm({ ...messageForm, content: '' });
        fetchChannelMessages(selectedChannel.id);
      } else {
        setError('Failed to send message');
      }
    } catch (err) {
      console.error('💥 Error sending message:', err);
      setError('Network error: Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setLoading(true);
      try {
        const result = await collaborationAPI.deleteNote(noteId);
        
        if (result?.ok || result?.status === 204) {
          setSuccess('Note deleted successfully!');
          fetchNotes();
        } else {
          setError('Failed to delete note');
        }
      } catch (err) {
        console.error('💥 Error deleting note:', err);
        setError('Network error: Failed to delete note');
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchCustomerFeedbacks = async () => {
    setFeedbackLoading(true);
    try {
      console.log('🔄 Fetching customer feedbacks...');
      const result = await projectManagersAPI.getCustomerFeedbacks();
      console.log('📨 Customer feedbacks response:', result);
      
      if (result?.ok) {
        setCustomerFeedbacks(result.data);
        console.log(`✅ Loaded ${result.data.length} feedback items`);
      } else {
        console.error('❌ Failed to fetch feedbacks:', result);
      }
    } catch (error) {
      console.error('💥 Error fetching feedbacks:', error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const fetchProjectOfficerInteractions = async () => {
    try {
      console.log('🔄 Fetching project officer interactions...');
      const result = await projectManagersAPI.getMyInteractions();
      console.log('📨 Project officer interactions response:', result);
      
      if (result?.ok) {
        setProjectOfficerInteractions(result.data);
        console.log(`✅ Loaded ${result.data.length} interaction items`);
      } else {
        console.error('❌ Failed to fetch project officer interactions:', result);
      }
    } catch (error) {
      console.error('💥 Error fetching project officer interactions:', error);
    }
  };

  const recordProjectOfficerInteraction = async (interactionData) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔄 Recording project officer interaction:', interactionData);
      
      const result = await projectManagersAPI.recordInteraction(interactionData);
      
      console.log('📡 Interaction API Response:', result);
      
      if (result?.ok) {
        setSuccess('Interaction recorded successfully!');
        setShowProjectOfficerInteractionModal(false);
        fetchData();
      } else {
        console.error('❌ Failed to record interaction:', result);
        setError('Failed to record interaction');
      }
    } catch (err) {
      console.error('💥 Error recording interaction:', err);
      setError('Network error: Failed to record interaction');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      console.log('🔄 Starting data fetch for:', user.user_type);

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

      // Fetch collaboration data for all users
      promises.push(
        fetchActivities().catch(err => console.warn('⚠️ Failed to fetch activities:', err))
      );

      promises.push(
        fetchChannels().catch(err => console.warn('⚠️ Failed to fetch channels:', err))
      );

      promises.push(
        fetchNotes().catch(err => console.warn('⚠️ Failed to fetch notes:', err))
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

        // Project management data for admin
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
                console.log('✅ Performance metrics API response:', result);
                console.log('📊 Full result.data:', result.data);
                console.log('🔍 performance_data array:', result.data.performance_data);
                
                if (result.data.performance_data) {
                  console.log('👥 Performance data items:', result.data.performance_data.length);
                  result.data.performance_data.forEach((officer, index) => {
                    console.log(`   Officer ${index}:`, officer);
                  });
                } else {
                  console.warn('❌ performance_data is null or undefined');
                }

                setPerformanceData(result.data.performance_data || []);
                console.log('🎯 Setting performanceData to:', result.data.performance_data || []);

              } else {
                console.warn('⚠️ Failed to fetch performance metrics - Response not OK:', result);
              }
              return result;
            })
            .catch(err => {
              console.warn('⚠️ Failed to fetch performance metrics - Error:', err);
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

        promises.push(
          fetchAdminInteractions().catch(err => {
            console.warn('⚠️ Failed to fetch admin interactions:', err);
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

        // Add project officer interactions fetch
        promises.push(
          fetchProjectOfficerInteractions().catch(err => {
            console.warn('⚠️ Failed to fetch project officer interactions:', err);
            return null;
          })
        );
      }

      // Add feedback fetch for admin and project officers
      if (user.user_type === 'admin' || user.user_type === 'project_officer') {
        promises.push(
          fetchCustomerFeedbacks().catch(err => {
            console.warn('⚠️ Failed to fetch feedbacks:', err);
            return null;
          })
        );
      }

      // Wait for all API calls to complete (success or failure)
      await Promise.all(promises);
      console.log('🎉 All data fetch operations completed');

    } catch (err) {
      console.error('💥 Critical error in fetchData:', err);
      setError('Failed to fetch some data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminInteractions = async () => {
    try {
      console.log('🔄 Fetching admin interactions...');
      const result = await projectManagersAPI.getAllInteractions();
      console.log('📨 Admin interactions response:', result);
      
      if (result?.ok) {
        setAdminInteractions(result.data);
        console.log(`✅ Loaded ${result.data.length} admin interaction items`);
      } else {
        console.error('❌ Failed to fetch admin interactions:', result);
      }
    } catch (error) {
      console.error('💥 Error fetching admin interactions:', error);
    }
  };

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
          evidence_image: null
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

  const updateIssueStatus = async (issueId, status, resolutionNotes = '') => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔄 Updating issue status:', { issueId, status, resolutionNotes });
      
      const result = await projectManagersAPI.updateIssueStatus(issueId, status, resolutionNotes);
      
      console.log('📡 API Response:', result);
      
      if (result?.ok) {
        setSuccess(`Issue status updated to ${status.replace('_', ' ')} successfully!`);
        fetchData();
      } else {
        console.error('❌ Failed to update issue status:', result);
        
        let errorMessage = 'Failed to update issue status';
        if (result?.data) {
          if (result.data.detail) {
            errorMessage = result.data.detail;
          } else if (result.data.message) {
            errorMessage = result.data.message;
          } else if (typeof result.data === 'string') {
            errorMessage = result.data;
          } else if (result.data.status) {
            errorMessage = result.data.status.join(', ');
          }
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error('💥 Unexpected error in updateIssueStatus:', err);
      setError('Network error: Failed to update issue status');
    } finally {
      setLoading(false);
    }
  };

  const submitCustomerFeedback = async (issueId, feedbackData) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔄 Submitting customer feedback:', { issueId, feedbackData });
      
      const { rating, comments = '' } = feedbackData;
      
      const result = await projectManagersAPI.addCustomerFeedback(issueId, comments, rating);
      
      console.log('📡 Feedback API Response:', result);
      
      if (result?.ok) {
        setSuccess('Feedback submitted successfully!');
        setShowFeedbackModal(false);
        setSelectedIssue(null);
        fetchData();
      } else {
        console.error('❌ Failed to submit feedback:', result);
        
        let errorMessage = 'Failed to submit feedback';
        if (result?.data) {
          if (result.data.detail) {
            errorMessage = result.data.detail;
          } else if (result.data.message) {
            errorMessage = result.data.message;
          } else if (typeof result.data === 'string') {
            errorMessage = result.data;
          } else if (result.data.feedback) {
            errorMessage = result.data.feedback.join(', ');
          }
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error('💥 Unexpected error in submitCustomerFeedback:', err);
      setError('Network error: Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

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

  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Define tabs based on user type
  const getTabItems = () => {
    const baseTabs = [
      { id: 'my-customers', label: 'My Customers', icon: User },
      { id: 'interactions', label: 'Interactions', icon: MessageSquare },
    ];

    const collaborationTabs = [
      { id: 'activity', label: 'Team Activity', icon: Activity },
      { id: 'channels', label: 'Channels', icon: MessageCircle },
      { id: 'notes', label: 'Shared Notes', icon: FileText },
    ];

    const projectOfficerTabs = [
      { id: 'meter-issues', label: 'Meter Issues', icon: AlertTriangle },
      { id: 'assigned-issues', label: 'My Assigned Issues', icon: Wrench },
      { id: 'field-interactions', label: 'Field Interactions', icon: MapPin },
      { id: 'customer-feedback', label: 'Customer Feedback', icon: MessageCircle },
      ...collaborationTabs,
    ];

    const adminTabs = [
      { id: 'real-time-dashboard', label: 'Live Dashboard', icon: Activity },
      { id: 'ai-analysis', label: 'AI Insights', icon: Activity }, 
      { id: 'customers', label: 'All Customers', icon: Users },
      ...baseTabs,
      { id: 'employees', label: 'Employees', icon: Settings },
      { id: 'project-management', label: 'Project Management', icon: Building2 },
      { id: 'field-interactions', label: 'Field Interactions', icon: MapPin },
      { id: 'customer-feedback', label: 'Customer Feedback', icon: MessageCircle },
      ...collaborationTabs,
      { id: 'reports', label: 'Reports', icon: BarChart3 },
      { id: 'audit', label: 'Audit Logs', icon: FileText }
    ];

    switch(user?.user_type) {
      case 'admin':
        return adminTabs;
      case 'project_officer':
        return projectOfficerTabs;
      default:
        return [...baseTabs, ...collaborationTabs];
    }
  };

  const renderCollaborationContent = () => {
    switch(activeTab) {
      case 'activity':
        return (
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Team Activity</h2>
                <p className="text-sm text-gray-600 mt-1">Recent team activities and updates</p>
              </div>
              <button
                onClick={fetchActivities}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors duration-200"
                disabled={collaborationLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${collaborationLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
            <ActivityFeed 
              activities={activities}
              user={user}
              onRefresh={fetchActivities}
            />
          </div>
        );

     // In your Dashboard component
const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);

// Add to your collaboration modals
const renderCollaborationModals = () => (
  <>
    <CreateChannelModal
      isOpen={showCreateChannelModal}
      onClose={() => setShowCreateChannelModal(false)}
      onCreate={createChannel}
    />
    
    {/* Channel Discovery Modal */}
    {showDiscoveryModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <ChannelDiscovery
          onJoinChannel={(channelId) => {
            setShowDiscoveryModal(false);
            fetchChannels(); // Refresh channels list
          }}
          onClose={() => setShowDiscoveryModal(false)}
        />
      </div>
    )}
    
    {/* ... your note modal */}
  </>
);

// Update your Channels tab to include discovery button
case 'channels':
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Team Channels</h2>
          <p className="text-sm text-gray-600 mt-1">
            Communicate with your team in real-time
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDiscoveryModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center transition-colors duration-200"
          >
            <Globe className="h-4 w-4 mr-1" />
            Discover Channels
          </button>
          <button
            onClick={() => setShowCreateChannelModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-1" />
            Create Channel
          </button>
        </div>
      </div>
      <ChannelList
        channels={channels}
        messages={messages}
        selectedChannel={selectedChannel}
        onSelectChannel={(channel) => {
          setSelectedChannel(channel);
          fetchChannelMessages(channel.id);
        }}
        messageForm={messageForm}
        setMessageForm={setMessageForm}
        onSendMessage={sendMessage}
        loading={loading || collaborationLoading}
      />
    </div>
  );

      case 'notes':
        return (
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Shared Notes</h2>
                <p className="text-sm text-gray-600 mt-1">Collaborative notes and documentation</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCreateNoteModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Note
                </button>
                <button
                  onClick={fetchNotes}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-colors duration-200"
                  disabled={collaborationLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${collaborationLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
            <NotesList
              notes={notes}
              onDeleteNote={deleteNote}
              loading={collaborationLoading}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderCollaborationModals = () => (
  <>
    
  {/* Create Channel Modal */}
  <CreateChannelModal
    isOpen={showCreateChannelModal}
    onClose={() => {
      setShowCreateChannelModal(false);
      setError('');
    }}
    onCreate={createChannel}
  />

  {/* Channel Discovery Modal */}
  {showDiscoveryModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <ChannelDiscovery
        onJoinChannel={(channelId) => {
          setShowDiscoveryModal(false);
          fetchChannels(); // Refresh channels list
        }}
        onClose={() => setShowDiscoveryModal(false)}
      />
    </div>
  )}

  {/* Create Note Modal */}
  {showCreateNoteModal && (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create Note</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={noteForm.title}
                onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter note title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                value={noteForm.content}
                onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter note content"
                rows="6"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={noteForm.is_public}
                onChange={(e) => setNoteForm({...noteForm, is_public: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Private Note</label>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowCreateNoteModal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={createNote}
              disabled={loading || !noteForm.title.trim() || !noteForm.content.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Note'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

  </>
);
  const tabItems = getTabItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
          {/* Collaboration Content */}
          {renderCollaborationContent()}

          {/* Existing Tab Content */}
          {activeTab === 'real-time-dashboard' && user?.user_type === 'admin' && (
            <div className="p-4 sm:p-6">
              <RealTimeDashboard 
                customers={customers}
                interactions={interactions}
                loading={loading}
              />
            </div>
          )}

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

          {activeTab === 'ai-analysis' && user?.user_type === 'admin' && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">AI Customer Insights</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Machine-powered analysis of your customer data
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <RefreshCw className="w-4 h-4" />
                  <span>Real-time Analysis</span>
                </div>
              </div>
              
              <AIDashboard 
                customers={customers}
                interactions={interactions}
                loading={loading}
              />
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
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowMeterIssueModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Report Issue
                  </button>
                  <button
                    onClick={() => setShowProjectOfficerInteractionModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center transition-colors duration-200"
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Record Interaction
                  </button>
                </div>
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

          {/* Field Interactions Tab (Project Officer) */}
          {activeTab === 'field-interactions' && user?.user_type === 'project_officer' && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h2 className="text-lg font-medium text-gray-900">Field Interactions</h2>
                <button
                  onClick={() => setShowProjectOfficerInteractionModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Record Interaction
                </button>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading interactions...</span>
                </div>
              ) : projectOfficerInteractions.length > 0 ? (
                <ProjectOfficerInteractionsList 
                  interactions={projectOfficerInteractions}
                />
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No field interactions recorded yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Start recording your field visits and customer interactions
                  </p>
                  <button
                    onClick={() => setShowProjectOfficerInteractionModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center mx-auto mt-4 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Record Your First Interaction
                  </button>
                </div>
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

          {/* Field Interactions Tab (Admin) */}
          {activeTab === 'field-interactions' && user?.user_type === 'admin' && (
            <div className="p-4 sm:p-6">
              <AdminInteractionsList 
                interactions={adminInteractions}
                loading={loading}
                onRefresh={fetchData}
              />
            </div>
          )}

          {/* Customer Feedback Tab (Admin & Project Officers) */}
          {(activeTab === 'customer-feedback' && (user?.user_type === 'admin' || user?.user_type === 'project_officer')) && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Customer Feedback</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {customerFeedbacks.length} feedback{customerFeedbacks.length !== 1 ? 's' : ''} received
                  </p>
                </div>
                
                {/* Feedback Stats */}
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {customerFeedbacks.filter(f => f.customer_rating >= 4).length}
                    </div>
                    <div className="text-gray-600">Positive</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {customerFeedbacks.filter(f => f.customer_rating === 3).length}
                    </div>
                    <div className="text-gray-600">Neutral</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {customerFeedbacks.filter(f => f.customer_rating <= 2).length}
                    </div>
                    <div className="text-gray-600">Needs Improvement</div>
                  </div>
                </div>
              </div>

              <CustomerFeedbackList 
                feedbacks={customerFeedbacks}
                loading={feedbackLoading}
              />
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
        onSubmit={(feedbackData) => {
          console.log('📝 Dashboard received feedback:', feedbackData);
          submitCustomerFeedback(selectedIssue.id, feedbackData);
        }}
        loading={loading}
        error={error}
      />

      {/* Project Officer Interaction Modal */}
      <ProjectOfficerInteractionForm
        show={showProjectOfficerInteractionModal}
        onClose={() => {
          setShowProjectOfficerInteractionModal(false);
          setError('');
        }}
        onSubmit={recordProjectOfficerInteraction}
        loading={loading}
        error={error}
        assignedArea={user?.assigned_area || "General Area"}
      />

      {/* Collaboration Modals */}
      {renderCollaborationModals()}
    </div>
  );
};

export default Dashboard;