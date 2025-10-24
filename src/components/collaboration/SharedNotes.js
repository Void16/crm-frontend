// src/components/collaboration/SharedNotes.js
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Share2, FileText, User, Calendar, X, ArrowLeft } from 'lucide-react';
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
      const result = await collaborationAPI.createNote(newNote);
      if (result?.ok) {
        onNotesUpdate(prev => [result.data, ...prev]);
        setShowCreateModal(false);
        setNewNote({ title: '', content: '', is_public: false });
        setSelectedNote(result.data);
      } else {
        onError('Failed to create note');
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
      if (result?.ok) {
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

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-full bg-white rounded-lg shadow border">
      {/* Notes Sidebar - Hidden on mobile when note is selected */}
      <div className={`w-full md:w-96 border-r border-gray-200 flex flex-col ${
        selectedNote ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Notes</h1>
              <p className="text-sm text-gray-500 mt-1">
                {notes.length} note{notes.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors shadow-lg"
              title="Create new note"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500">
              <FileText className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-center mb-2">No notes yet</p>
              <p className="text-sm text-center text-gray-400 mb-4">
                Create your first note to get started
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Note
              </button>
            </div>
          ) : (
            <div className="p-2">
              {notes.map(note => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`p-4 rounded-lg mb-2 cursor-pointer hover:bg-gray-50 transition-colors border ${
                    selectedNote?.id === note.id 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 flex-1 mr-2 break-words">
                      {note.title}
                    </h4>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                      {note.is_public && (
                        <Share2 className="w-4 h-4 text-green-600" title="Public note" />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 break-words">
                    {note.content}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span className="truncate">{note.created_by_name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatTime(note.updated_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Note Content */}
      <div className={`flex-1 flex flex-col ${selectedNote ? 'flex' : 'hidden md:flex'}`}>
        {selectedNote ? (
          <>
            {/* Header with back button for mobile */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedNote(null)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-semibold text-gray-900 break-words">
                    {selectedNote.title}
                  </h1>
                  <div className="flex items-center flex-wrap gap-2 mt-1">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      <span>By {selectedNote.created_by_name}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedNote.updated_at)}</span>
                    </div>
                    {selectedNote.is_public && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                        Public
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Edit note"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Note Content */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
              <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border">
                <pre className="whitespace-pre-wrap font-sans text-gray-800 text-sm leading-relaxed break-words overflow-wrap-anywhere">
                  {selectedNote.content}
                </pre>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-900 mb-2">Select a Note</p>
              <p className="text-gray-500">Choose a note from the sidebar to view its content</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Note Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Create New Note</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 md:p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 md:py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter note title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  rows="12"
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 md:py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none break-words whitespace-pre-wrap"
                  placeholder="Write your note content..."
                  required
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={newNote.is_public}
                  onChange={(e) => setNewNote(prev => ({ ...prev, is_public: e.target.checked }))}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-4 h-4"
                />
                <label htmlFor="is_public" className="text-sm text-gray-700">
                  Make this note public to all team members
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-4 md:p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-3 md:py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full md:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={createNote}
                disabled={!newNote.title.trim() || !newNote.content.trim() || loading}
                className="bg-green-600 text-white px-4 py-3 md:py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full md:w-auto"
              >
                {loading ? 'Creating...' : 'Create Note'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button for Mobile */}
      {!selectedNote && (
        <div className="fixed bottom-6 right-6 z-20 md:hidden">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-green-700 flex items-center justify-center transition-all duration-200 active:scale-95"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SharedNotes;