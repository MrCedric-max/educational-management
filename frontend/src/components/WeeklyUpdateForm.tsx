import React, { useState } from 'react';
import { X, Plus, Trash2, Send } from 'lucide-react';

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

interface WeeklyUpdateFormProps {
  parent: Parent | null;
  onSave: () => void;
  onCancel: () => void;
}

const WeeklyUpdateForm: React.FC<WeeklyUpdateFormProps> = ({
  parent,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    studentId: parent?.id || '',
    parentId: parent?.id || '',
    weekOf: new Date().toISOString().split('T')[0],
    academicProgress: '',
    behaviorNotes: '',
    achievements: [''],
    areasForImprovement: [''],
    upcomingEvents: [''],
    teacherNotes: ''
  });

  const [newAchievement, setNewAchievement] = useState('');
  const [newImprovement, setNewImprovement] = useState('');
  const [newEvent, setNewEvent] = useState('');

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const addImprovement = () => {
    if (newImprovement.trim()) {
      setFormData(prev => ({
        ...prev,
        areasForImprovement: [...prev.areasForImprovement, newImprovement.trim()]
      }));
      setNewImprovement('');
    }
  };

  const removeImprovement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      areasForImprovement: prev.areasForImprovement.filter((_, i) => i !== index)
    }));
  };

  const addEvent = () => {
    if (newEvent.trim()) {
      setFormData(prev => ({
        ...prev,
        upcomingEvents: [...prev.upcomingEvents, newEvent.trim()]
      }));
      setNewEvent('');
    }
  };

  const removeEvent = (index: number) => {
    setFormData(prev => ({
      ...prev,
      upcomingEvents: prev.upcomingEvents.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.academicProgress.trim()) {
      alert('Please fill in the academic progress section');
      return;
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Weekly Progress Update
            {parent && ` - ${parent.studentName}`}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Week Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Week Of *
            </label>
            <input
              type="date"
              value={formData.weekOf}
              onChange={(e) => handleInputChange('weekOf', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Academic Progress */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Progress *
            </label>
            <textarea
              value={formData.academicProgress}
              onChange={(e) => handleInputChange('academicProgress', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the student's academic progress this week..."
            />
          </div>

          {/* Behavior Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Behavior Notes
            </label>
            <textarea
              value={formData.behaviorNotes}
              onChange={(e) => handleInputChange('behaviorNotes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any behavioral observations or notes..."
            />
          </div>

          {/* Achievements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Achievements
            </label>
            <div className="space-y-2">
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) => {
                      const newAchievements = [...formData.achievements];
                      newAchievements[index] = e.target.value;
                      setFormData(prev => ({ ...prev, achievements: newAchievements }));
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter an achievement..."
                  />
                  <button
                    onClick={() => removeAchievement(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a new achievement..."
                />
                <button
                  onClick={addAchievement}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center space-x-1"
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Areas for Improvement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Areas for Improvement
            </label>
            <div className="space-y-2">
              {formData.areasForImprovement.map((improvement, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={improvement}
                    onChange={(e) => {
                      const newImprovements = [...formData.areasForImprovement];
                      newImprovements[index] = e.target.value;
                      setFormData(prev => ({ ...prev, areasForImprovement: newImprovements }));
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter an area for improvement..."
                  />
                  <button
                    onClick={() => removeImprovement(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newImprovement}
                  onChange={(e) => setNewImprovement(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addImprovement()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add an area for improvement..."
                />
                <button
                  onClick={addImprovement}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center space-x-1"
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upcoming Events
            </label>
            <div className="space-y-2">
              {formData.upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={event}
                    onChange={(e) => {
                      const newEvents = [...formData.upcomingEvents];
                      newEvents[index] = e.target.value;
                      setFormData(prev => ({ ...prev, upcomingEvents: newEvents }));
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter an upcoming event..."
                  />
                  <button
                    onClick={() => removeEvent(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newEvent}
                  onChange={(e) => setNewEvent(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addEvent()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add an upcoming event..."
                />
                <button
                  onClick={addEvent}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center space-x-1"
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Teacher Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Teacher Notes
            </label>
            <textarea
              value={formData.teacherNotes}
              onChange={(e) => handleInputChange('teacherNotes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional notes or observations..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
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
              <span>Send Update</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyUpdateForm;
