import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentName: string;
  studentGrade: string;
  studentClass: string;
  preferredContact: 'email' | 'phone' | 'both';
}

interface MessageFormProps {
  parent: Parent | null;
  onSave: () => void;
  onCancel: () => void;
}

const MessageForm: React.FC<MessageFormProps> = ({
  parent,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    parentId: parent?.id || '',
    studentId: parent?.id || '',
    subject: '',
    content: '',
    type: 'general' as 'general' | 'urgent' | 'update' | 'meeting'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.subject.trim() || !formData.content.trim()) {
      alert('Please fill in both subject and content');
      return;
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Send Message
            {parent && ` to ${parent.name}`}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Message Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="general">General</option>
              <option value="urgent">Urgent</option>
              <option value="update">Progress Update</option>
              <option value="meeting">Meeting Request</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter message subject..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your message..."
            />
          </div>

          {/* Parent Info */}
          {parent && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recipient Information</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Parent:</strong> {parent.name}</p>
                <p><strong>Student:</strong> {parent.studentName} (Grade {parent.studentGrade}, {parent.studentClass})</p>
                <p><strong>Email:</strong> {parent.email}</p>
                <p><strong>Phone:</strong> {parent.phone}</p>
                <p><strong>Preferred Contact:</strong> {parent.preferredContact}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-2"
            >
              <Send size={16} />
              <span>Send Message</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageForm;
