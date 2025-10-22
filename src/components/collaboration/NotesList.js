// src/components/collaboration/SharedNotes.js
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Share2, FileText, User, Calendar, X } from 'lucide-react';
import { collaborationAPI } from '../../services/api';

const SharedNotes = ({ notes, user, onNotesUpdate, onError }) => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', is_public: false });
  const [loading, setLoading] = useState(false);

  const createNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    setLoading(true);
    try {
      console.log('Creating note with data:', newNote);
      const result = await collaborationAPI.createNote(newNote);
      console.log('Create note result:', result);
      
      if (result?.ok) {
        onNotesUpdate(prev => [result.data, ...prev]);
        setShowCreateModal(false);
        setNewNote({ title: '', content: '', is_public: false });
        setSelectedNote(result.data);
      } else {
        console.error('Failed to create note:', result);
        const errorMsg = result?.data?.detail || JSON.stringify(result?.data) || 'Failed to create note';
        onError(errorMsg);
      }
    } catch (error) {
      console.error('Error creating note:', error);
      onError('Network error creating note');
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      const result = await collaborationAPI.deleteNote(noteId);
      if (result?.ok || result?.status === 204) {
        onNotesUpdate(prev => prev.filter(note => note.id !== noteId));
        if (selectedNote?.id === noteId) {
          setSelectedNote(null);
        }
      } else {
        onError('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      onError('Network error deleting note');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow border">
      {/* Notes Sidebar */}
      <div className="w-96 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Shared Notes</h3>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              title="Create new note"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notes.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No notes yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                Create your first note
              </button>
            </div>
          ) : (
            notes.map(note => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedNote?.id === note.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 truncate flex-1 mr-2">
                    {note.title}
                  </h4>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    {note.is_public && (
                      <Share2 className="w-3 h-3 text-green-600" title="Public note" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {note.content}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{note.created_by_name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(note.updated_at)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Note Content */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{selectedNote.title}</h1>
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Edit note"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {selectedNote.is_public && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      Public
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Created by {selectedNote.created_by_name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Updated {formatDate(selectedNote.updated_at)}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-800 text-sm leading-relaxed">
                  {selectedNote.content}
                </pre>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            {notes.length === 0 ? 'Create a note to get started' : 'Select a note to view its content'}
          </div>
        )}
      </div>

      {/* Create Note Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Create New Note</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter note title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  rows="12"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Write your note content..."
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={newNote.is_public}
                  onChange={(e) => setNewNote(prev => ({ ...prev, is_public: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_public" className="text-sm text-gray-700">
                  Make this note public to all team members
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createNote}
                disabled={!newNote.title.trim() || !newNote.content.trim() || loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating...' : 'Create Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedNotes;