import React, { useState, useEffect } from 'react';
import { 
  Users, MessageSquare, Plus, User, Settings, 
  BarChart3, FileText, LogOut, Building2, Menu, X,
  AlertTriangle, Wrench, CheckCircle, Clock, Activity, MessageCircle,
  MapPin, RefreshCw, Globe, Upload, Eye 
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
import DocumentReportsList from '../components/reports/DocumentReportsList';
import JobCardList from '../components/technician/JobCardList';
import JobCardForm from '../components/technician/JobCardForm';
import UpdateManager from '../components/common/UpdateManager';

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
import FeedbackManagement from '../components/admin/FeedbackManagement';
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
      case 'technician': return 'my-jobcards';
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
  const [documentReports, setDocumentReports] = useState([]);
  const [documentReportsLoading, setDocumentReportsLoading] = useState(false);
  
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

  const [jobCards, setJobCards] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [editingJobCard, setEditingJobCard] = useState(null);
  const [selectedJobCard, setSelectedJobCard] = useState(null);
  const [showJobCardModal, setShowJobCardModal] = useState(false);
  
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

  const fetchMyJobCards = async () => {
    try {
      console.log('🔄 Fetching my job cards...');
      const result = await api.technician.getMyJobCards();
      console.log('📊 Job cards API response:', result);
      if (result?.ok) {
        setJobCards(result.data || []);
        console.log(`✅ Loaded ${result.data?.length || 0} job cards`);
      } else {
        console.warn('❌ Failed to fetch job cards:', result);
        setJobCards([]);
      }
    } catch (error) {
      console.error('💥 Error fetching job cards:', error);
      setJobCards([]);
    }
  };

  const fetchAvailableJobs = async () => {
    try {
      console.log('🔄 Fetching available jobs...');
      const result = await api.technician.getAvailableJobs();
      console.log('📊 Available jobs API response:', result);
      if (result?.ok) {
        setAvailableJobs(result.data || []);
        console.log(`✅ Loaded ${result.data?.length || 0} available jobs`);
      } else {
        console.warn('❌ Failed to fetch available jobs:', result);
        setAvailableJobs([]);
      }
    } catch (error) {
      console.error('💥 Error fetching available jobs:', error);
      setAvailableJobs([]);
    }
  };

 // In Dashboard.js, update createJobCard:
const createJobCard = async (jobCardData) => {
  setLoading(true);
  setError('');
  
  try {
    // Helper function to limit decimal places
    const limitDecimals = (num, decimals = 6) => {
      if (num === null || num === undefined || num === '') return null;
      
      const numValue = typeof num === 'string' ? parseFloat(num) : num;
      
      if (isNaN(numValue)) return null;
      
      // Use toFixed to limit decimal places, then parseFloat to remove trailing zeros
      return parseFloat(numValue.toFixed(decimals));
    };
    
    // Convert data types and limit decimals
    const dataToSend = {
      ...jobCardData,
      // ✅ ADD THIS: Limit to 6 decimal places
      latitude: jobCardData.latitude ? limitDecimals(jobCardData.latitude, 6) : null,
      longitude: jobCardData.longitude ? limitDecimals(jobCardData.longitude, 6) : null,
      scheduled_date: jobCardData.scheduled_date || null,
      due_date: jobCardData.due_date || null,
      
      // Also clean other optional fields
      customer_email: jobCardData.customer_email || '',
      meter_reading: jobCardData.meter_reading || '',
      location_notes: jobCardData.location_notes || '',
      emergency_contact_name: jobCardData.emergency_contact_name || '',
      emergency_contact_phone: jobCardData.emergency_contact_phone || '',
    };
    
    // Debug logging
    console.log('📤 Sending data:', dataToSend);
    console.log('📍 Latitude:', dataToSend.latitude, 'Type:', typeof dataToSend.latitude);
    console.log('📍 Longitude:', dataToSend.longitude, 'Type:', typeof dataToSend.longitude);
    
    // ✅ FIXED: Use dynamic API URL based on environment
    let apiUrl;
    if (window.location.origin.includes('render.com')) {
      apiUrl = 'https://crm-api-romn.onrender.com';
      console.log('🌐 Production: Using API URL:', apiUrl);
    } else {
      apiUrl = 'http://localhost:8000';
      console.log('💻 Development: Using API URL:', apiUrl);
    }
    
    console.log('🔗 Final API URL:', `${apiUrl}/api/auth/jobcards/`);
    
    // Use fetch directly with JSON
    const response = await fetch(`${apiUrl}/api/auth/jobcards/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(dataToSend),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      setSuccess('Job card created successfully!');
      setShowJobCardModal(false);
      await fetchMyJobCards();
      return true;
    } else {
      console.error('Server error:', data);
      
      // Format error messages better
      let errorMessage = '';
      if (data.detail) {
        errorMessage = data.detail;
      } else if (typeof data === 'object') {
        errorMessage = Object.entries(data)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
          .join('; ');
      } else {
        errorMessage = 'Failed to create job card';
      }
      
      setError(errorMessage);
      return false;
    }
  } catch (err) {
    console.error('Network error:', err);
    setError('Network error: Failed to create job card');
    return false;
  } finally {
    setLoading(false);
  }
};


const updateJobCardStatus = async (jobCardId, status, additionalData = {}) => {
  setLoading(true);
  setError('');
  
  try {
    console.log(`🔄 Updating job card ${jobCardId} status to: ${status}`);
    
    let result;
    
    if (status === 'start_job') {
      // Start job action
      result = await api.technician.startJob(jobCardId);
    } else if (status === 'complete_job') {
      // Complete job action - send additional data
      result = await api.technician.completeJob(jobCardId, additionalData);
    } else {
      // Generic status update
      result = await api.technician.updateJobStatus(jobCardId, status);
    }
    
    console.log('📊 Job card update response:', result);
    
    if (result?.ok) {
      const statusMessages = {
        'assigned': 'Job assigned successfully!',
        'in_progress': 'Job started successfully!',
        'completed': 'Job completed successfully!',
        'cancelled': 'Job cancelled.',
        'on_hold': 'Job put on hold.',
        'start_job': 'Job started successfully!',
        'complete_job': 'Job completed successfully!'
      };
      
      setSuccess(statusMessages[status] || `Status updated to ${status}`);
      
      // Refresh job data
      await fetchMyJobCards();
      await fetchAvailableJobs();
      
      return true;
    } else {
      console.error('❌ Failed to update job card:', result);
      
      let errorMessage = `Failed to update job status to ${status}`;
      if (result?.data) {
        errorMessage = result.data.detail || result.data.message || JSON.stringify(result.data);
      }
      
      setError(errorMessage);
      return false;
    }
  } catch (err) {
    console.error('💥 Error updating job card:', err);
    setError('Network error: Failed to update job card');
    return false;
  } finally {
    setLoading(false);
  }
};

// Also add this function for claiming available jobs:
const handleClaimJob = async (jobId) => {
  setLoading(true);
  setError('');
  
  try {
    console.log(`🔄 Claiming job ${jobId}`);
    
    const result = await api.technician.assignToMe(jobId);
    
    console.log('📊 Claim job response:', result);
    
    if (result?.ok) {
      setSuccess('Job claimed successfully!');
      
      // Refresh job data
      await fetchMyJobCards();
      await fetchAvailableJobs();
      
      return true;
    } else {
      let errorMessage = 'Failed to claim job';
      if (result?.data) {
        errorMessage = result.data.detail || result.data.message || JSON.stringify(result.data);
      }
      setError(errorMessage);
      return false;
    }
  } catch (err) {
    console.error('💥 Error claiming job:', err);
    setError('Network error: Failed to claim job');
    return false;
  } finally {
    setLoading(false);
  }
};

  //to remove(....)

  
//to remove(....)

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

  const fetchDocumentReports = async () => {
    setDocumentReportsLoading(true);
    try {
      console.log('🔄 Fetching document reports...');
      const result = await api.documentReports.getMyReports();
      console.log('📨 Document reports response:', result);
      
      if (result?.ok) {
        setDocumentReports(result.data);
        console.log(`✅ Loaded ${result.data.length} document reports`);
      } else {
        console.error('❌ Failed to fetch document reports:', result);
      }
    } catch (error) {
      console.error('💥 Error fetching document reports:', error);
    } finally {
      setDocumentReportsLoading(false);
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

       // ✅ ADD THIS: Technician-specific data fetching
    if (user.user_type === 'technician') {
      console.log('🔧 Fetching technician job data...');
      
      promises.push(
        fetchMyJobCards().catch(err => {
          console.warn('⚠️ Failed to fetch job cards:', err);
          return null;
        })
      );
      
      promises.push(
        fetchAvailableJobs().catch(err => {
          console.warn('⚠️ Failed to fetch available jobs:', err);
          return null;
        })
      );
    }

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

      promises.push(
        fetchDocumentReports().catch(err => {
          console.warn('⚠️ Failed to fetch document reports:', err);
          return null;
        })
      );

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

useEffect(() => {
    console.log('🔧 Dashboard Debug:');
    console.log('- User:', user);
    console.log('- User type:', user?.user_type);
    console.log('- Active tab:', activeTab);
    console.log('- Job cards:', jobCards);
    console.log('- Available jobs:', availableJobs);
    
    // If user switches to technician tabs, refresh the data
    if (user?.user_type === 'technician') {
      if (activeTab === 'my-jobcards') {
        console.log('🔄 Fetching job cards for technician...');
        fetchMyJobCards();
      } else if (activeTab === 'available-jobs') {
        console.log('🔄 Fetching available jobs for technician...');
        fetchAvailableJobs();
      }
    }
  }, [activeTab, user]);

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
      { id: 'document-reports', label: 'Document Reports', icon: Upload }, 
      ...collaborationTabs,
    ];

    const technicianTabs = [
    { id: 'my-jobcards', label: 'My Job Cards', icon: FileText },
    { id: 'available-jobs', label: 'Available Jobs', icon: Wrench },
    { id: 'create-jobcard', label: 'Create Job Card', icon: Plus },
    { id: 'document-reports', label: 'Document Reports', icon: Upload },
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
      { id: 'public-feedback', label: 'Public Feedback', icon: MessageSquare },
      { id: 'document-reports', label: 'Document Reports', icon: Upload },
      ...collaborationTabs,
      { id: 'reports', label: 'Reports', icon: BarChart3 },
      { id: 'audit', label: 'Audit Logs', icon: FileText }
    ];

    switch(user?.user_type) {
      case 'admin':
        return adminTabs;
      case 'technician':
        return technicianTabs;
      case 'project_officer':
        return projectOfficerTabs;
      default:
        return [...baseTabs, { id: 'document-reports', label: 'Document Reports', icon: Upload }, ...collaborationTabs];
    }
  };


  const renderCollaborationContent = () => {
  switch(activeTab) {
    case 'activity':
      return (
        <div className="flex flex-col h-full bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Activity</h1>
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {activities.length}
                </span>
              </div>
              <button
                onClick={fetchActivities}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                disabled={collaborationLoading}
              >
                <RefreshCw className={`h-5 w-5 ${collaborationLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">Recent team activities</p>
          </div>

          {/* Activity List */}
          <div className="flex-1 overflow-y-auto">
            <ActivityFeed 
              activities={activities}
              user={user}
              onRefresh={fetchActivities}
            />
          </div>
        </div>
      );

    case 'channels':
      return (
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <div className="bg-green-600 text-white px-4 py-3 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Channels</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDiscoveryModal(true)}
                  className="p-2 hover:bg-green-700 rounded-full transition-colors"
                >
                  <Globe className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowCreateChannelModal(true)}
                  className="p-2 hover:bg-green-700 rounded-full transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
            <p className="text-green-100 text-sm mt-1">Team communication</p>
          </div>

          {/* Channel List */}
          <div className="flex-1 overflow-y-auto">
  <ChannelList
    channels={channels}
    messages={messages}
    selectedChannel={selectedChannel}
    onSelectChannel={(channel) => {
      setSelectedChannel(channel);
      // Only fetch messages if channel is not null
      if (channel && channel.id) {
        fetchChannelMessages(channel.id);
      } else {
        // Optional: Clear messages when no channel is selected
        setMessages([]);
      }
    }}
    messageForm={messageForm}
    setMessageForm={setMessageForm}
    onSendMessage={sendMessage}
    loading={loading || collaborationLoading}
  />
</div>
        </div>
      );

    case 'notes':
      return (
        <div className="flex flex-col h-full bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Notes</h1>
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {notes.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={fetchNotes}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={collaborationLoading}
                >
                  <RefreshCw className={`h-5 w-5 ${collaborationLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setShowCreateNoteModal(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Collaborative notes</p>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto">
            <NotesList
              notes={notes}
              onDeleteNote={deleteNote}
              loading={collaborationLoading}
            />
          </div>

          {/* Floating Action Button for Mobile */}
          <div className="sticky bottom-6 right-6 z-20 sm:hidden">
            <button
              onClick={() => setShowCreateNoteModal(true)}
              className="absolute bottom-0 right-4 bg-green-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-green-700 flex items-center justify-center transition-all duration-200 active:scale-95"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
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
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <ChannelDiscovery
              onJoinChannel={(channelId) => {
                setShowDiscoveryModal(false);
                fetchChannels(); // Refresh channels list
              }}
              onClose={() => setShowDiscoveryModal(false)}
            />
          </div>
        </div>
      )}

      {/* Create Note Modal */}
      {showCreateNoteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-full max-w-md sm:w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create Note</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    placeholder="Enter note title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    value={noteForm.content}
                    onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    placeholder="Enter note content"
                    rows="4"
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
              <div className="flex flex-col xs:flex-row justify-end space-y-2 xs:space-y-0 xs:space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateNoteModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 w-full xs:w-auto transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={createNote}
                  disabled={loading || !noteForm.title.trim() || !noteForm.content.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 w-full xs:w-auto transition-colors duration-200"
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
      <UpdateManager />
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo and Title */}
            <div className="flex items-center min-w-0 flex-1">
              <img 
                src="/bi.ico" 
                alt="BI Logo" 
                className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 mr-2 sm:mr-3 flex-shrink-0" 
              />
              <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 truncate">
                <span className="hidden sm:inline">CRM BI Solutions</span>
                <span className="sm:hidden">CRM BI</span>
              </h1>
            </div>

            {/* Desktop User Info and Logout */}
            <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
              <button
                onClick={handleProfileClick}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm lg:text-base"
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
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm lg:text-base"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden flex-shrink-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
                <span className="text-sm text-gray-600 truncate">{user?.first_name} {user?.last_name}</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex-shrink-0">
                  {user?.user_type}
                </span>
              </div>
            </div>
            <div className="py-2 max-h-[70vh] overflow-y-auto">
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
                  onClick={() => {
                    handleTabChange(tab.id);
                    setMobileMenuOpen(false);
                  }}
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        {success && (
          <Notification type="success" message={success} onClose={() => setSuccess('')} />
        )}
        {error && (
          <Notification type="error" message={error} onClose={() => setError('')} />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
        {/* Desktop Navigation Tabs */}
        <div className="hidden sm:block border-b border-gray-200 mb-4 lg:mb-6">
          <nav className="-mb-px flex space-x-4 lg:space-x-6 xl:space-x-8 overflow-x-auto">
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
        <div className="bg-white rounded-lg shadow-sm sm:shadow">
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
                  <Plus className="h-4 w-4 mr-2" />
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
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-gray-900">AI Customer Insights</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Machine-powered analysis of your customer data
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden xs:inline">Real-time Analysis</span>
                  <span className="xs:hidden">Real-time</span>
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
                  <Plus className="h-4 w-4 mr-2" />
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
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center mx-auto transition-colors duration-200 max-w-xs"
                  >
                    <Plus className="h-4 w-4 mr-2" />
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
                  <Plus className="h-4 w-4 mr-2" />
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


          {/* Document Reports Tab (All Users) */}
          {activeTab === 'document-reports' && (
            <div className="p-4 sm:p-6">
              <DocumentReportsList 
                reports={documentReports}
                loading={documentReportsLoading}
                onRefresh={fetchDocumentReports}
              />
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
                <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowMeterIssueModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center transition-colors duration-200 w-full xs:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden xs:inline">Report Issue</span>
                    <span className="xs:hidden">Report</span>
                  </button>
                  <button
                    onClick={() => setShowProjectOfficerInteractionModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center transition-colors duration-200 w-full xs:w-auto"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="hidden xs:inline">Record Interaction</span>
                    <span className="xs:hidden">Interaction</span>
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
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center transition-colors duration-200 w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden xs:inline">Record Interaction</span>
                  <span className="xs:hidden">Record</span>
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
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center mx-auto mt-4 transition-colors duration-200 max-w-xs"
                  >
                    <Plus className="h-4 w-4 mr-2" />
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

          {/* Technician Tabs */}
          {activeTab === 'my-jobcards' && user?.user_type === 'technician' && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  My Job Cards ({jobCards.length})
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      console.log('🔄 Manually refreshing job cards...');
                      fetchMyJobCards();
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={() => setActiveTab('available-jobs')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                  >
                    View Available Jobs ({availableJobs.length})
                  </button>
                </div>
              </div>
              
              {/* Debug info - temporary */}
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Debug Info:</strong> User type: {user?.user_type}, 
                  Job Cards: {jobCards.length}, 
                  Available: {availableJobs.length}
                </p>
                <button
                  onClick={() => {
                    console.log('Current state:', { jobCards, availableJobs, user });
                    fetchMyJobCards();
                    fetchAvailableJobs();
                  }}
                  className="mt-2 text-sm text-yellow-700 underline"
                >
                  Click to debug
                </button>
              </div>
              
              <JobCardList
                jobCards={jobCards}
                onView={(jobCard) => setSelectedJobCard(jobCard)}
                onEdit={(jobCard) => {
                  setEditingJobCard(jobCard);
                  setShowJobCardModal(true);
                }}
                onUpdateStatus={updateJobCardStatus}
                loading={loading}
              />
            </div>
          )}

          {activeTab === 'available-jobs' && user?.user_type === 'technician' && (
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Available Jobs ({availableJobs.length})
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('my-jobcards')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  View My Jobs ({jobCards.length})
                </button>
              </div>
            </div>
            
            {availableJobs.length === 0 ? (
              <div className="text-center py-8">
                <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No available jobs at the moment</p>
                <p className="text-sm text-gray-400 mt-1">
                  New jobs will appear here when assigned by project officers
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-gray-800">#{job.job_number}</span>
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Available
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">{job.customer_name}</h3>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Location:</span> {job.customer_address}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Work Type:</span> {job.work_type}
                        </p>
                        <div className="flex items-center gap-2 mt-2 mb-3">
                          <span className="text-sm text-gray-600">Priority:</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            job.priority === 'high' ? 'bg-red-100 text-red-800' :
                            job.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {job.priority?.toUpperCase() || 'MEDIUM'}
                          </span>
                          {job.estimated_duration && (
                            <span className="text-sm text-gray-600">
                              <span className="font-medium ml-2">Est. Time:</span> {job.estimated_duration}
                            </span>
                          )}
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => {
                              // View full details
                              setSelectedJobCard(job);
                            }}
                            className="px-4 py-2 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              console.log('Claiming job:', job.id);
                              handleClaimJob(job.id);
                            }}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors flex items-center"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Claim Job
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
    
    {/* Job Card Details Modal */}
    {selectedJobCard && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Job Card Details - #{selectedJobCard.job_number}
              </h2>
              <button
                onClick={() => setSelectedJobCard(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Customer Name:</span>
                    <p className="font-medium">{selectedJobCard.customer_name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Address:</span>
                    <p className="font-medium">{selectedJobCard.customer_address}</p>
                  </div>
                  {selectedJobCard.customer_phone && (
                    <div>
                      <span className="text-sm text-gray-600">Phone:</span>
                      <p className="font-medium">{selectedJobCard.customer_phone}</p>
                    </div>
                  )}
                  {selectedJobCard.customer_email && (
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <p className="font-medium">{selectedJobCard.customer_email}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Job Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Wrench className="h-5 w-5 mr-2" />
                  Job Details
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Work Type:</span>
                    <p className="font-medium">{selectedJobCard.work_type}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Priority:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ml-2 ${
                      selectedJobCard.priority === 'high' ? 'bg-red-100 text-red-800' :
                      selectedJobCard.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedJobCard.priority?.toUpperCase() || 'MEDIUM'}
                    </span>
                  </div>
                  {selectedJobCard.estimated_duration && (
                    <div>
                      <span className="text-sm text-gray-600">Estimated Duration:</span>
                      <p className="font-medium">{selectedJobCard.estimated_duration}</p>
                    </div>
                  )}
                  {selectedJobCard.scheduled_date && (
                    <div>
                      <span className="text-sm text-gray-600">Scheduled Date:</span>
                      <p className="font-medium">
                        {new Date(selectedJobCard.scheduled_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Additional Information */}
              {selectedJobCard.description && (
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Job Description
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedJobCard.description}</p>
                </div>
              )}
              
              {/* Location Information */}
              {(selectedJobCard.latitude || selectedJobCard.longitude) && (
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Location Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedJobCard.latitude && (
                      <div>
                        <span className="text-sm text-gray-600">Latitude:</span>
                        <p className="font-medium">{selectedJobCard.latitude}</p>
                      </div>
                    )}
                    {selectedJobCard.longitude && (
                      <div>
                        <span className="text-sm text-gray-600">Longitude:</span>
                        <p className="font-medium">{selectedJobCard.longitude}</p>
                      </div>
                    )}
                    {selectedJobCard.location_notes && (
                      <div className="md:col-span-2">
                        <span className="text-sm text-gray-600">Location Notes:</span>
                        <p className="font-medium">{selectedJobCard.location_notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Emergency Contact */}
              {(selectedJobCard.emergency_contact_name || selectedJobCard.emergency_contact_phone) && (
                <div className="md:col-span-2 bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedJobCard.emergency_contact_name && (
                      <div>
                        <span className="text-sm text-gray-600">Contact Name:</span>
                        <p className="font-medium">{selectedJobCard.emergency_contact_name}</p>
                      </div>
                    )}
                    {selectedJobCard.emergency_contact_phone && (
                      <div>
                        <span className="text-sm text-gray-600">Contact Phone:</span>
                        <p className="font-medium">{selectedJobCard.emergency_contact_phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedJobCard(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  console.log('Claiming job:', selectedJobCard.id);
                  handleClaimJob(selectedJobCard.id);
                  setSelectedJobCard(null);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Claim This Job
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
)}

          {activeTab === 'create-jobcard' && user?.user_type === 'technician' && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h2 className="text-lg font-medium text-gray-900">Create Job Card</h2>
              </div>
              <div className="max-w-2xl mx-auto">
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <p className="text-gray-600 mb-4">
                    Create a new job card for immediate tasks. These will be added to your assigned jobs.
                  </p>
                  <button
                    onClick={() => setShowJobCardModal(true)}
                    className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
                  >
                    Create New Job Card
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Customer Feedback Tab (Admin & Project Officers) */}
          {(activeTab === 'customer-feedback' && (user?.user_type === 'admin' || user?.user_type === 'project_officer')) && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-gray-900">Customer Feedback</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {customerFeedbacks.length} feedback{customerFeedbacks.length !== 1 ? 's' : ''} received
                  </p>
                </div>
                
                {/* Feedback Stats */}
                <div className="flex gap-3 sm:gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">
                      {customerFeedbacks.filter(f => f.customer_rating >= 4).length}
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm">Positive</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-600">
                      {customerFeedbacks.filter(f => f.customer_rating === 3).length}
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm">Neutral</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-orange-600">
                      {customerFeedbacks.filter(f => f.customer_rating <= 2).length}
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm">Needs Improvement</div>
                  </div>
                </div>
              </div>

              <CustomerFeedbackList 
                feedbacks={customerFeedbacks}
                loading={feedbackLoading}
              />
            </div>
          )}

          {/* Public Feedback Tab (Admin Only) */}
          {activeTab === 'public-feedback' && user?.user_type === 'admin' && (
            <div className="p-4 sm:p-6">
              <FeedbackManagement />
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

       {/* ✅ ADD JOB CARD MODAL HERE */}
      <JobCardForm
      show={showJobCardModal}
      onClose={() => {
        console.log('🔧 Closing Job Card Modal');
        setShowJobCardModal(false);
        setEditingJobCard(null);
        setError('');
      }}
      onSubmit={(formData) => {
        console.log('🔧 Submitting job card form:', formData);
        console.log('🔧 Editing job card:', editingJobCard);
        console.log('🔧 createJobCard function:', typeof createJobCard);
        
        if (createJobCard) {
          createJobCard(formData);
        } else {
          console.error('❌ createJobCard is not defined!');
          setError('Failed to create job card: Function not available');
        }
      }}
      loading={loading}
      error={error}
      jobCard={editingJobCard}  // ✅ Changed from initialData to jobCard
    />

      {/* Collaboration Modals */}
      {renderCollaborationModals()}
    </div>
  );
};

export default Dashboard;