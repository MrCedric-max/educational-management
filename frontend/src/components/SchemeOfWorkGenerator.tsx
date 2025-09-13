import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Download, 
  Calendar, 
  Target, 
  Users, 
  Clock, 
  FileText,
  BookOpen,
  CheckCircle,
  X
} from 'lucide-react';
import { useAnglophoneCurriculum } from '../contexts/AnglophoneCurriculumContext';
import toast from 'react-hot-toast';

interface SchemeOfWorkGeneratorProps {
  onClose: () => void;
  onSave: (scheme: any) => void;
}

const SchemeOfWorkGenerator: React.FC<SchemeOfWorkGeneratorProps> = ({ onClose, onSave }) => {
  const { getLevels, getSubjects } = useAnglophoneCurriculum();
  
  const [scheme, setScheme] = useState({
    subjectId: '',
    levelId: '',
    term: 1,
    week: 1,
    topic: '',
    objectives: [''],
    content: [''],
    activities: [''],
    resources: [''],
    assessment: [''],
    duration: 45,
    prerequisites: [''],
    keywords: ['']
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const levels = getLevels();
  const subjects = getSubjects();

  const addObjective = () => {
    setScheme(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setScheme(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const removeObjective = (index: number) => {
    setScheme(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const addContent = () => {
    setScheme(prev => ({
      ...prev,
      content: [...prev.content, '']
    }));
  };

  const updateContent = (index: number, value: string) => {
    setScheme(prev => ({
      ...prev,
      content: prev.content.map((item, i) => i === index ? value : item)
    }));
  };

  const removeContent = (index: number) => {
    setScheme(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index)
    }));
  };

  const addActivity = () => {
    setScheme(prev => ({
      ...prev,
      activities: [...prev.activities, '']
    }));
  };

  const updateActivity = (index: number, value: string) => {
    setScheme(prev => ({
      ...prev,
      activities: prev.activities.map((activity, i) => i === index ? value : activity)
    }));
  };

  const removeActivity = (index: number) => {
    setScheme(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
  };

  const addResource = () => {
    setScheme(prev => ({
      ...prev,
      resources: [...prev.resources, '']
    }));
  };

  const updateResource = (index: number, value: string) => {
    setScheme(prev => ({
      ...prev,
      resources: prev.resources.map((resource, i) => i === index ? value : resource)
    }));
  };

  const removeResource = (index: number) => {
    setScheme(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const addAssessment = () => {
    setScheme(prev => ({
      ...prev,
      assessment: [...prev.assessment, '']
    }));
  };

  const updateAssessment = (index: number, value: string) => {
    setScheme(prev => ({
      ...prev,
      assessment: prev.assessment.map((item, i) => i === index ? value : item)
    }));
  };

  const removeAssessment = (index: number) => {
    setScheme(prev => ({
      ...prev,
      assessment: prev.assessment.filter((_, i) => i !== index)
    }));
  };

  const addPrerequisite = () => {
    setScheme(prev => ({
      ...prev,
      prerequisites: [...prev.prerequisites, '']
    }));
  };

  const updatePrerequisite = (index: number, value: string) => {
    setScheme(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.map((item, i) => i === index ? value : item)
    }));
  };

  const removePrerequisite = (index: number) => {
    setScheme(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }));
  };

  const addKeyword = () => {
    setScheme(prev => ({
      ...prev,
      keywords: [...prev.keywords, '']
    }));
  };

  const updateKeyword = (index: number, value: string) => {
    setScheme(prev => ({
      ...prev,
      keywords: prev.keywords.map((keyword, i) => i === index ? value : keyword)
    }));
  };

  const removeKeyword = (index: number) => {
    setScheme(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (!scheme.subjectId || !scheme.levelId || !scheme.topic) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newScheme = {
      ...scheme,
      id: `generated-${Date.now()}`,
      objectives: scheme.objectives.filter(obj => obj.trim()),
      content: scheme.content.filter(item => item.trim()),
      activities: scheme.activities.filter(activity => activity.trim()),
      resources: scheme.resources.filter(resource => resource.trim()),
      assessment: scheme.assessment.filter(item => item.trim()),
      prerequisites: scheme.prerequisites.filter(item => item.trim()),
      keywords: scheme.keywords.filter(keyword => keyword.trim())
    };

    onSave(newScheme);
    toast.success('Scheme of work generated successfully!');
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Auto-generate some content based on the topic
    if (scheme.topic) {
      setScheme(prev => ({
        ...prev,
        objectives: [
          `Understand the concept of ${scheme.topic}`,
          `Apply knowledge of ${scheme.topic} in practical situations`,
          `Analyze different aspects of ${scheme.topic}`
        ],
        content: [
          `Introduction to ${scheme.topic}`,
          `Key concepts and principles`,
          `Practical applications`
        ],
        activities: [
          `Group discussion on ${scheme.topic}`,
          `Hands-on practice activities`,
          `Problem-solving exercises`
        ],
        resources: [
          'Textbooks and reference materials',
          'Visual aids and charts',
          'Practical equipment'
        ],
        assessment: [
          'Written assessment',
          'Practical demonstration',
          'Class participation'
        ],
        keywords: scheme.topic.toLowerCase().split(' ')
      }));
    }
    
    setIsGenerating(false);
    toast.success('Content generated successfully!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Generate Scheme of Work</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level *
                </label>
                <select
                  value={scheme.levelId}
                  onChange={(e) => setScheme(prev => ({ ...prev, levelId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Level</option>
                  {levels.map(level => (
                    <option key={level.id} value={level.id}>{level.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  value={scheme.subjectId}
                  onChange={(e) => setScheme(prev => ({ ...prev, subjectId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Term
                </label>
                <select
                  value={scheme.term}
                  onChange={(e) => setScheme(prev => ({ ...prev, term: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>Term 1</option>
                  <option value={2}>Term 2</option>
                  <option value={3}>Term 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Week
                </label>
                <select
                  value={scheme.week}
                  onChange={(e) => setScheme(prev => ({ ...prev, week: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: 13 }, (_, i) => i + 1).map(week => (
                    <option key={week} value={week}>Week {week}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={scheme.duration}
                  onChange={(e) => setScheme(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic *
              </label>
              <input
                type="text"
                value={scheme.topic}
                onChange={(e) => setScheme(prev => ({ ...prev, topic: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the topic for this scheme of work"
              />
            </div>

            {/* Learning Objectives */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Learning Objectives
                </label>
                <button
                  onClick={addObjective}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {scheme.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter learning objective"
                    />
                    <button
                      onClick={() => removeObjective(index)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <button
                  onClick={addContent}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {scheme.content.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateContent(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter content item"
                    />
                    <button
                      onClick={() => removeContent(index)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Activities */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Activities
                </label>
                <button
                  onClick={addActivity}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {scheme.activities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={activity}
                      onChange={(e) => updateActivity(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter activity"
                    />
                    <button
                      onClick={() => removeActivity(index)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Resources
                </label>
                <button
                  onClick={addResource}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {scheme.resources.map((resource, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={resource}
                      onChange={(e) => updateResource(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter resource"
                    />
                    <button
                      onClick={() => removeResource(index)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Assessment
                </label>
                <button
                  onClick={addAssessment}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {scheme.assessment.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateAssessment(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter assessment method"
                    />
                    <button
                      onClick={() => removeAssessment(index)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !scheme.topic}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Generate Content
                </>
              )}
            </button>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Scheme
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeOfWorkGenerator;





