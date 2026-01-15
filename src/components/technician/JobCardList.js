import React, { useState } from 'react';
import {
  Calendar, MapPin, User, Phone,
  Clock, CheckCircle, AlertCircle,
  Wrench, FileText, Download,
  Eye, Edit, Trash2, X,
  FileSpreadsheet
} from 'lucide-react';
import * as XLSX from 'xlsx'; // npm install xlsx

const JobCardList = ({ jobCards, onView, onEdit, onDelete, onUpdateStatus, loading }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [completionData, setCompletionData] = useState({
    work_completed: '',
    hours_worked: '',
    materials_list: '',
    material_cost: '',
    customer_feedback: '',
    customer_rating: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Export to Excel function
  const exportToExcel = () => {
    // Filter data based on current filter
    const dataToExport = filteredJobCards.length > 0 ? filteredJobCards : jobCards;
    
    // Prepare data with required columns
    const exportData = dataToExport.map(job => ({
      'Meter Number': job.meter_number || 'N/A',
      'Customer Name': job.customer_name || 'N/A',
      'Phone Number': job.customer_phone || 'N/A',
      'Address': job.customer_address || 'N/A',
      'Job Number': job.job_number || 'N/A',
      'Job Type': job.job_type_display || job.job_type || 'N/A',
      'Status': job.status_display || job.status.replace('_', ' ') || 'N/A',
      'Scheduled Date': job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString() : 'N/A',
      'Due Date': job.due_date ? new Date(job.due_date).toLocaleDateString() : 'N/A',
      'Priority': job.priority_display || job.priority || 'Medium',
      'Technician': job.technician_name || 'Unassigned',
      'Created Date': job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Auto-size columns
    const wscols = [
      { wch: 15 }, // Meter Number
      { wch: 20 }, // Customer Name
      { wch: 15 }, // Phone Number
      { wch: 30 }, // Address
      { wch: 15 }, // Job Number
      { wch: 15 }, // Job Type
      { wch: 15 }, // Status
      { wch: 15 }, // Scheduled Date
      { wch: 12 }, // Due Date
      { wch: 10 }, // Priority
      { wch: 20 }, // Technician
      { wch: 15 }  // Created Date
    ];
    ws['!cols'] = wscols;
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Job Cards");
    
    // Generate filename with current date and filter
    const dateStr = new Date().toISOString().split('T')[0];
    const filterStr = filterStatus !== 'all' ? `_${filterStatus}` : '';
    const fileName = `job_cards${filterStr}_${dateStr}.xlsx`;
    
    // Export the file
    XLSX.writeFile(wb, fileName);
  };

  const filteredJobCards = jobCards.filter(job => {
    if (filterStatus === 'all') return true;
    return job.status === filterStatus;
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-orange-100 text-orange-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusIcons = {
    pending: AlertCircle,
    assigned: Clock,
    in_progress: Wrench,
    completed: CheckCircle,
    cancelled: AlertCircle,
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Open completion modal
  const handleCompleteClick = (jobCard) => {
    setSelectedJob(jobCard);
    setCompletionData({
      work_completed: '',
      hours_worked: '',
      materials_list: '',
      material_cost: '',
      customer_feedback: '',
      customer_rating: '',
    });
    setFormErrors({});
    setShowCompletionModal(true);
  };

  // Handle form changes
  const handleCompletionChange = (e) => {
    const { name, value } = e.target;
    setCompletionData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!completionData.work_completed.trim()) {
      errors.work_completed = 'Work completed is required';
    }

    if (!completionData.hours_worked) {
      errors.hours_worked = 'Hours worked is required';
    } else if (parseFloat(completionData.hours_worked) <= 0) {
      errors.hours_worked = 'Hours worked must be greater than 0';
    }

    if (completionData.material_cost &&
      parseFloat(completionData.material_cost) < 0) {
      errors.material_cost = 'Material cost cannot be negative';
    }

    if (completionData.customer_rating &&
      (parseInt(completionData.customer_rating) < 1 ||
        parseInt(completionData.customer_rating) > 5)) {
      errors.customer_rating = 'Rating must be between 1 and 5';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit completion
  const handleSubmitCompletion = async () => {
    if (!selectedJob) return;

    if (!validateForm()) {
      return;
    }

    try {
      const dataToSend = {
        work_completed: completionData.work_completed,
        hours_worked: parseFloat(completionData.hours_worked),
        materials_list: completionData.materials_list || '',
        material_cost: completionData.material_cost ?
          parseFloat(completionData.material_cost) : 0,
      };

      // Add optional fields if they exist
      if (completionData.customer_feedback) {
        dataToSend.customer_feedback = completionData.customer_feedback;
      }

      if (completionData.customer_rating) {
        dataToSend.customer_rating =
          parseInt(completionData.customer_rating);
      }

      console.log('Submitting completion data:', dataToSend);

      await onUpdateStatus(selectedJob.id, 'complete_job',
        dataToSend);

      // Reset and close modal
      setShowCompletionModal(false);
      setSelectedJob(null);
      setCompletionData({
        work_completed: '',
        hours_worked: '',
        materials_list: '',
        material_cost: '',
        customer_feedback: '',
        customer_rating: '',
      });
      setFormErrors({});

    } catch (error) {
      console.error('Completion failed:', error);
      // Error will be handled by the parent component
    }
  };

  // Print job card function
  const printJobCard = (jobCard) => {
    const printWindow = window.open('', '_blank');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Job Card - ${jobCard.job_number}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2c5282;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .company-name {
            color: #2c5282;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .job-card-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .section {
            margin-bottom: 25px;
            padding: 15px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
          }
          .section-title {
            font-weight: bold;
            color: #2c5282;
            border-bottom: 2px solid #cbd5e0;
            padding-bottom: 8px;
            margin-bottom: 15px;
            font-size: 16px;
          }
          .job-details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .signature-area {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
          }
          .signature-box {
            width: 45%;
            border-top: 2px solid #000;
            padding-top: 20px;
            text-align: center;
          }
          .field-label {
            font-weight: 600;
            color: #4a5568;
            margin-bottom: 5px;
          }
          .field-value {
            margin-bottom: 12px;
            padding-left: 10px;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 5px;
          }
          .status-pending { background-color: #fef3c7; color: #92400e; }
          .status-assigned { background-color: #dbeafe; color: #1e40af; }
          .status-in_progress { background-color: #ffedd5; color: #9a3412; }
          .status-completed { background-color: #d1fae5; color: #065f46; }
          .status-cancelled { background-color: #fee2e2; color: #991b1b; }
          .print-button {
            margin-top: 30px;
            padding: 12px 24px;
            background: #2c5282;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
          }
          .print-button:hover {
            background: #2b6cb0;
          }
          @media print {
            .no-print { display: none !important; }
            body { margin: 0; }
            .section { border: none; padding: 10px 0; }
          }
          @page {
            margin: 0.5in;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">BHUNGANE INVESTMENTS</div>
          <div class="job-card-title">JOB CARD</div>
          <div>
            <strong>Job Number:</strong> ${jobCard.job_number} |
            <strong>Date:</strong> ${formatDate(jobCard.created_at)} |
            <span class="status-badge status-${jobCard.status}">
              ${jobCard.status_display ||
        jobCard.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
        
        <div class="job-details">
          <div class="section">
            <div class="section-title">CUSTOMER DETAILS</div>
            <div class="field-label">Name:</div>
            <div class="field-value">${jobCard.customer_name}</div>
            
            <div class="field-label">Address:</div>
            <div class="field-value">${jobCard.customer_address}</div>
            
            <div class="field-label">Phone:</div>
            <div class="field-value">${jobCard.customer_phone}</div>
            
            <div class="field-label">Email:</div>
            <div class="field-value">${jobCard.customer_email ||
        'N/A'}</div>
          </div>
          
          <div class="section">
            <div class="section-title">METER DETAILS</div>
            <div class="field-label">Meter Number:</div>
            <div class="field-value">${jobCard.meter_number}</div>
            
            <div class="field-label">Meter Type:</div>
            <div class="field-value">${jobCard.meter_type ||
        'N/A'}</div>
            
            <div class="field-label">Meter Reading:</div>
            <div class="field-value">${jobCard.meter_reading ||
        'N/A'}</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">JOB DETAILS</div>
          <div class="field-label">Job Type:</div>
          <div class="field-value">${jobCard.job_type_display ||
        jobCard.job_type}</div>
          
          <div class="field-label">Scheduled Date:</div>
          <div class="field-value">${formatDate(jobCard.scheduled_date)}</div>
          
          <div class="field-label">Due Date:</div>
          <div class="field-value">${formatDate(jobCard.due_date) ||
        'N/A'}</div>
          
          <div class="field-label">Priority:</div>
          <div class="field-value">${jobCard.priority_display ||
        jobCard.priority || 'Medium'}</div>
          
          <div class="field-label">Job Description:</div>
          <div class="field-value">${jobCard.job_description ||
        'N/A'}</div>
        </div>
        
        ${jobCard.work_completed ? `
        <div class="section">
          <div class="section-title">WORK COMPLETED</div>
          <div class="field-value">${jobCard.work_completed}</div>
        </div>
        ` : ''}
        
        ${jobCard.status === 'completed' ? `
        <div class="section">
          <div class="section-title">COST DETAILS</div>
          <div class="field-label">Hours Worked:</div>
          <div class="field-value">${jobCard.hours_worked ||
        '0'}</div>
          
          <div class="field-label">Labor Cost:</div>
          <div class="field-value">R ${parseFloat(jobCard.labor_cost || 0).toFixed(2)}</div>
          
          <div class="field-label">Material Cost:</div>
          <div class="field-value">R ${parseFloat(jobCard.material_cost || 0).toFixed(2)}</div>
          
          <div class="field-label">Total Cost:</div>
          <div class="field-value"><strong>R ${parseFloat(jobCard.total_cost || 0).toFixed(2)}</strong></div>
        </div>
        ` : ''}
        
        ${jobCard.customer_feedback ? `
        <div class="section">
          <div class="section-title">CUSTOMER FEEDBACK</div>
          <div class="field-value">${jobCard.customer_feedback}</div>
          ${jobCard.customer_rating ? `
          <div class="field-label">Rating:</div>
          <div class="field-value">${'★'.repeat(jobCard.customer_rating)}${'☆'.repeat(5 -
        jobCard.customer_rating)} (${jobCard.customer_rating}/5)</div>
          ` : ''}
        </div>
        ` : ''}
        
        <div class="signature-area">
          <div class="signature-box">
            <div><strong>CUSTOMER SIGNATURE</strong></div>
            <div style="margin-top: 40px;">_________________________________________</div>
            <div style="margin-top: 10px;">Date: _____________________________</div>
          </div>
          
          <div class="signature-box">
            <div><strong>TECHNICIAN SIGNATURE</strong></div>
            <div style="margin-top: 40px;">_________________________________________</div>
            <div style="margin-top: 10px;">Date: _____________________________</div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 40px;" class="no-print">
          <button class="print-button" onclick="window.print();">
            Print Job Card
          </button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading job cards...</span>
      </div>
    );
  }

  if (filteredJobCards.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No job cards found</p>
        {filterStatus !== 'all' && (
          <button
            onClick={() => setFilterStatus('all')}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            Clear filter
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Filters and Export */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Jobs ({jobCards.length})
          </button>
          {Object.entries(statusColors).map(([status, colorClass]) => {
            const StatusIcon = statusIcons[status];
            const count = jobCards.filter(j => j.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  filterStatus === status
                    ? `${colorClass} font-semibold shadow-sm`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <StatusIcon className="h-4 w-4" />
                {status.replace('_', ' ').toUpperCase()} ({count})
              </button>
            );
          })}
          
          {/* Export to Excel Button */}
          <button
            onClick={exportToExcel}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 shadow-sm"
            title="Export to Excel"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export to Excel
          </button>
        </div>
        {filterStatus !== 'all' && (
          <div className="mt-2 text-sm text-gray-600">
            Showing {filteredJobCards.length} {filterStatus.replace('_', ' ')} jobs
            <span className="ml-2 text-green-600 font-medium">
              (Export button exports filtered data)
            </span>
          </div>
        )}
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobCards.map((jobCard) => {
          const StatusIcon = statusIcons[jobCard.status] ||
            AlertCircle;

          return (
            <div
              key={jobCard.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{jobCard.customer_name}</h3>
                    <p className="text-sm text-gray-500 mt-1">#{jobCard.job_number}</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5
                    ${statusColors[jobCard.status]}`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {jobCard.status_display ||
                      jobCard.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              {/* Card Body */}
              <div className="p-5">
                <div className="space-y-4">
                  <div className="flex items-start text-sm text-gray-700">
                    <User className="h-4 w-4 mt-0.5 mr-3 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{jobCard.customer_phone}</span>
                  </div>
                  
                  <div className="flex items-start text-sm text-gray-700">
                    <MapPin className="h-4 w-4 mt-0.5 mr-3 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{jobCard.customer_address.substring(0,
                      50)}...</span>
                  </div>
                  
                  <div className="flex items-start text-sm text-gray-700">
                    <Wrench className="h-4 w-4 mt-0.5 mr-3 text-gray-400 flex-shrink-0" />
                    <span>{jobCard.job_type_display ||
                      jobCard.job_type}</span>
                  </div>
                  
                  <div className="flex items-start text-sm text-gray-700">
                    <Calendar className="h-4 w-4 mt-0.5 mr-3 text-gray-400 flex-shrink-0" />
                    <span>Scheduled: {formatDate(jobCard.scheduled_date)}</span>
                  </div>
                </div>
                
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {jobCard.job_description || 'No description provided'}
                  </p>
                </div>
              </div>
              {/* Card Footer */}
              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onView(jobCard)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    {jobCard.status !== 'completed' && jobCard.status !== 'cancelled' && (
                      <button
                        onClick={() => onEdit(jobCard)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => printJobCard(jobCard)}
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Print Job Card"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    {jobCard.status === 'assigned' && (
                      <button
                        onClick={() => onUpdateStatus(jobCard.id,
                          'start_job')}
                        className="px-4 py-2 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg hover:bg-orange-100 transition-colors flex items-center gap-2"
                      >
                        <Wrench className="h-3.5 w-3.5" />
                        Start Job
                      </button>
                    )}
                    
                    {jobCard.status === 'in_progress' && (
                      <button
                        onClick={() => handleCompleteClick(jobCard)}
                        className="px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Modal */}
      {showCompletionModal && selectedJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowCompletionModal(false)}
            ></div>
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Complete Job: #{selectedJob.job_number}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Customer: {selectedJob.customer_name}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCompletionModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {/* Work Completed */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Work Completed <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="work_completed"
                      value={completionData.work_completed}
                      onChange={handleCompletionChange}
                      className={`w-full rounded-md border ${
                        formErrors.work_completed ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                      rows="3"
                      placeholder="Describe the work that was completed..."
                      required
                    />
                    {formErrors.work_completed && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.work_completed}</p>
                    )}
                  </div>
                  {/* Hours Worked */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hours Worked <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="hours_worked"
                      value={completionData.hours_worked}
                      onChange={handleCompletionChange}
                      className={`w-full rounded-md border ${
                        formErrors.hours_worked ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                      step="0.5"
                      min="0.5"
                      placeholder="2.5"
                      required
                    />
                    {formErrors.hours_worked && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.hours_worked}</p>
                    )}
                  </div>
                  {/* Materials Used */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Materials Used
                    </label>
                    <textarea
                      name="materials_list"
                      value={completionData.materials_list}
                      onChange={handleCompletionChange}
                      className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      rows="2"
                      placeholder="List materials used (optional)..."
                    />
                  </div>
                  {/* Material Cost */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material Cost (R)
                    </label>
                    <input
                      type="number"
                      name="material_cost"
                      value={completionData.material_cost}
                      onChange={handleCompletionChange}
                      className={`w-full rounded-md border ${
                        formErrors.material_cost ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                    {formErrors.material_cost && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.material_cost}</p>
                    )}
                  </div>
                  {/* Customer Feedback */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Feedback
                    </label>
                    <textarea
                      name="customer_feedback"
                      value={completionData.customer_feedback}
                      onChange={handleCompletionChange}
                      className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      rows="2"
                      placeholder="Customer feedback (optional)..."
                    />
                  </div>
                  {/* Customer Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Rating (1-5)
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setCompletionData(prev => ({
                            ...prev,
                            customer_rating: rating.toString()
                          }))}
                          className={`p-2 rounded-full ${
                            completionData.customer_rating === rating.toString()
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          <span className="text-lg">★</span>
                          <span className="text-xs ml-1">{rating}</span>
                        </button>
                      ))}
                    </div>
                    {formErrors.customer_rating && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.customer_rating}</p>
                    )}
                  </div>
                </div>
              </div>
              {/* Modal footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmitCompletion}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Complete Job
                </button>
                <button
                  type="button"
                  onClick={() => setShowCompletionModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobCardList;