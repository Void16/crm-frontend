import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DocumentReportsList = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await axios.get('/api/reports/document-reports/my_reports/');
            setReports(response.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadSuccess = () => {
        setShowUpload(false);
        fetchReports();
        setSuccess('Document uploaded successfully! It will be included in the weekly email to admins.');
    };

    const downloadDocument = async (report) => {
        try {
            // Use the full URL from the backend
            let fileUrl = report.file_url;
            
            // If it's a relative URL, prepend the base URL
            if (fileUrl && fileUrl.startsWith('/')) {
                fileUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${fileUrl}`;
            }
            
            console.log('📥 Downloading from:', fileUrl);
            
            const response = await fetch(fileUrl, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                
                // Get filename from response headers or use a default
                const contentDisposition = response.headers.get('content-disposition');
                let filename = report.file_name || `document_${report.id}`;
                
                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                    if (filenameMatch) {
                        filename = filenameMatch[1];
                    }
                }
                
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
                setSuccess('Document downloaded successfully!');
                setError('');
            } else {
                console.error('Download failed:', response.status, response.statusText);
                setError('Failed to download document: ' + response.statusText);
                setSuccess('');
            }
        } catch (err) {
            console.error('Download error:', err);
            setError('Failed to download document: ' + err.message);
            setSuccess('');
        }
    };

    // Clear messages after 5 seconds
    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess('');
                setError('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    if (loading) return <div>Loading reports...</div>;

    return (
        <div className="reports-container">
            <div className="reports-header">
                <h2>Document Reports</h2>
                <button
                    onClick={() => setShowUpload(true)}
                    className="btn btn-primary"
                >
                    Upload New Report
                </button>
            </div>

            {/* Success and Error Messages */}
            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}
            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {showUpload && (
                <DocumentUpload
                    onUploadSuccess={handleUploadSuccess}
                    onCancel={() => setShowUpload(false)}
                />
            )}

            <div className="reports-list">
                {reports.length === 0 ? (
                    <div className="empty-state">
                        <p>No reports uploaded yet.</p>
                        <p>Click "Upload New Report" to get started.</p>
                    </div>
                ) : (
                    reports.map(report => (
                        <div key={report.id} className="report-card">
                            <div className="report-header">
                                <h3>{report.title}</h3>
                                <span className={`status-badge status-${report.status}`}>
                                    {report.status}
                                </span>
                            </div>
                            
                            <div className="report-meta">
                                <p><strong>Description:</strong> {report.description || 'No description'}</p>
                                <p><strong>File:</strong> {report.file_name}</p>
                                <p><strong>Uploaded:</strong> {new Date(report.created_at).toLocaleDateString()}</p>
                                {report.submitted_at && (
                                    <p><strong>Submitted:</strong> {new Date(report.submitted_at).toLocaleDateString()}</p>
                                )}
                            </div>

                            <div className="report-actions">
                                <button
                                    onClick={() => downloadDocument(report)}
                                    className="btn btn-outline"
                                >
                                    Download Document
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DocumentReportsList;