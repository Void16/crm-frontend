import React, { useState } from 'react';
import { Upload, Download, Trash2, Eye, Calendar, User, FileText } from 'lucide-react';
import { api } from '../../services/api';
import Notification from '../common/Notification';

const DocumentReportsList = ({ reports, loading, onRefresh }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    document: null
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if it's a supported file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/pdf',
        'text/plain',
        'application/rtf'
      ];
      
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const validExtensions = ['doc', 'docx', 'pdf', 'txt', 'rtf'];
      
      if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
        setError('Please upload a Word document (.doc, .docx), PDF, or text file');
        return;
      }
      
      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setUploadForm({ ...uploadForm, document: file });
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadForm.title.trim() || !uploadForm.document) {
      setError('Please provide a title and select a document');
      return;
    }

    setUploadLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('document', uploadForm.document);
      formData.append('status', 'submitted'); // Auto-submit

      const result = await api.documentReports.create(formData);
      
      if (result?.ok) {
        setSuccess('Document uploaded successfully! It will be included in the weekly email to admins.');
        setShowUploadModal(false);
        setUploadForm({
          title: '',
          description: '',
          document: null
        });
        setUploadProgress(0);
        onRefresh(); // Refresh the list
      } else {
        const errorMsg = result?.data?.detail || 
                        result?.data?.message || 
                        Object.values(result?.data || {}).flat().join(', ') ||
                        'Failed to upload document';
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Network error: Failed to upload document');
    } finally {
      setUploadLoading(false);
    }
  };

  const downloadDocument = async (report) => {
    try {
      if (report.file_url) {
        const response = await api.documentReports.downloadDocument(report.file_url);
        
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = report.file_name || `document_${report.id}`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        } else {
          setError('Failed to download document');
        }
      } else {
        setError('Document file not available');
      }
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download document');
    }
  };

  const deleteReport = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this document report?')) {
      try {
        const result = await api.documentReports.delete(reportId);
        
        if (result?.ok || result?.status === 204) {
          setSuccess('Document report deleted successfully!');
          onRefresh();
        } else {
          setError('Failed to delete document report');
        }
      } catch (err) {
        console.error('Delete error:', err);
        setError('Network error: Failed to delete document report');
      }
    }
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <FileText className="h-5 w-5" />;
    
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-600" />;
      case 'txt':
        return <FileText className="h-5 w-5 text-gray-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Clear notifications after 3 seconds
  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {success && (
        <Notification type="success" message={success} onClose={() => setSuccess('')} />
      )}
      {error && (
        <Notification type="error" message={error} onClose={() => setError('')} />
      )}

      {/* Upload Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">My Document Reports</h3>
          <p className="text-sm text-gray-600">
            Upload Word documents, PDFs, or text files. They will be automatically emailed to admins every Sunday.
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors duration-200"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </button>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading document reports...</span>
        </div>
      ) : reports.length > 0 ? (
        <div className="grid gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getFileIcon(report.file_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-medium text-gray-900 truncate">
                      {report.title}
                    </h4>
                    {report.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {report.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{report.author_name || report.author_username}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {new Date(report.created_at).toLocaleDateString()} at{' '}
                          {new Date(report.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      {report.file_name && (
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {report.file_name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => downloadDocument(report)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Download document"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteReport(report.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete report"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No document reports yet</h3>
          <p className="text-gray-600 mb-4">
            Upload your first document report to get started.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Upload Your First Document
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-6 border w-full max-w-md sm:max-w-lg shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Document Report</h3>
              
              <form onSubmit={handleUpload}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Report Title *
                    </label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter report title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief description of the report (optional)"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Document File *
                    </label>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept=".doc,.docx,.pdf,.txt,.rtf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,text/plain,application/rtf"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: .doc, .docx, .pdf, .txt, .rtf (Max size: 10MB)
                    </p>
                    {uploadForm.document && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-800">
                          Selected: {uploadForm.document.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadForm({ title: '', description: '', document: null });
                      setError('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors w-full sm:w-auto"
                    disabled={uploadLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploadLoading || !uploadForm.title.trim() || !uploadForm.document}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors w-full sm:w-auto"
                  >
                    {uploadLoading ? 'Uploading...' : 'Upload & Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentReportsList;