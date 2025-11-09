import React, { useState } from 'react';
import axios from 'axios';

const DocumentUpload = ({ onUploadSuccess, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [document, setDocument] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if it's a Word document
            const validTypes = [
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/msword'
            ];
            
            if (!validTypes.includes(file.type)) {
                alert('Please upload a Word document (.doc or .docx)');
                return;
            }
            
            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                return;
            }
            
            setDocument(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim() || !document) {
            alert('Please provide a title and select a document');
            return;
        }

        setIsSubmitting(true);
        
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('document', document);
            formData.append('status', 'submitted'); // Auto-submit

            await axios.post('/api/reports/document-reports/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = (progressEvent.loaded / progressEvent.total) * 100;
                    setUploadProgress(progress);
                }
            });

            onUploadSuccess();
        } catch (error) {
            console.error('Error uploading document:', error);
            alert('Error uploading document. Please try again.');
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="document-upload">
            <h3>Upload Document Report</h3>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Report Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter report title"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of the report (optional)"
                        rows="3"
                    />
                </div>

                <div className="form-group">
                    <label>Word Document *</label>
                    <input
                        type="file"
                        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileSelect}
                        required
                    />
                    <small>Accepted formats: .doc, .docx (Max size: 10MB)</small>
                </div>

                {uploadProgress > 0 && (
                    <div className="upload-progress">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <span>{Math.round(uploadProgress)}%</span>
                    </div>
                )}

                <div className="form-actions">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="btn btn-primary"
                    >
                        {isSubmitting ? 'Uploading...' : 'Upload & Submit Report'}
                    </button>
                    <button 
                        type="button" 
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="btn btn-outline"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DocumentUpload;