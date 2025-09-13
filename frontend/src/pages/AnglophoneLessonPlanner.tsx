import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Save, Eye, Clock, BookOpen, Target, Users, FileText, Upload, Download, ArrowLeft, Zap, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AutoLessonPlanGenerator from '../components/AutoLessonPlanGenerator';
import { lessonService, LessonPlan as ApiLessonPlan } from '../services/lessonService';
import { useFileManagement } from '../contexts/FileManagementContext';
import { useFeatureManagement } from '../contexts/FeatureManagementContext';
import FileUpload from '../components/FileUpload';
import FileBrowser from '../components/FileBrowser';

interface LearningObjective {
  id: string;
  description: string;
  completed: boolean;
  selected?: boolean;
}

interface Material {
  id: string;
  name: string;
  selected?: boolean;
}

interface Activity {
  id: string;
  description: string;
}

interface LessonStage {
  id: string;
  stage: string;
  content: string;
  facilitatingActivities: string;
  learningActivities: string;
  resources: string;
}

interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  class: string;
  date: string;
  time: string;
  duration: string;
  learningTheme: string;
  selectedObjective: string;
  domain: string;
  entryBehaviour: string;
  objectives: LearningObjective[];
  materials: Material[];
  activities: Activity[];
  stages: LessonStage[];
  assessmentMethod: string;
  references: string;
  createdAt: Date;
  updatedAt: Date;
}

// Template types for Anglophone lessons
type AnglophoneTemplateType = 'english-language' | 'mathematics' | 'science' | 'social-studies';

// Template configurations for different subjects
const anglophoneTemplateConfigs = {
  'english-language': {
    title: 'English Language',
    duration: '45 minutes',
    learningTheme: 'Communication',
    domain: 'Listening and Speaking',
    objectives: [
      'Develop listening and speaking skills',
      'Enhance vocabulary knowledge',
      'Improve pronunciation and fluency',
      'Practice reading comprehension'
    ],
    stages: [
      { stage: 'INTRODUCTION', focus: 'Warm-up and engagement' },
      { stage: 'PRESENTATION', focus: 'New content delivery' },
      { stage: 'APPLICATION', focus: 'Practice and reinforcement' }
    ]
  },
  'mathematics': {
    title: 'Mathematics',
    duration: '45 minutes',
    learningTheme: 'Problem Solving',
    domain: 'Number Operations',
    objectives: [
      'Solve mathematical problems',
      'Apply number operations',
      'Develop logical thinking',
      'Practice problem-solving strategies'
    ],
    stages: [
      { stage: 'INTRODUCTION', focus: 'Review and warm-up' },
      { stage: 'PRESENTATION', focus: 'New concept introduction' },
      { stage: 'APPLICATION', focus: 'Practice exercises' }
    ]
  },
  'science': {
    title: 'Science',
    duration: '45 minutes',
    learningTheme: 'Critical Thinking',
    domain: 'Scientific Inquiry',
    objectives: [
      'Develop scientific thinking',
      'Conduct simple experiments',
      'Observe and record findings',
      'Understand scientific concepts'
    ],
    stages: [
      { stage: 'INTRODUCTION', focus: 'Engagement and prior knowledge' },
      { stage: 'PRESENTATION', focus: 'Scientific concept explanation' },
      { stage: 'APPLICATION', focus: 'Hands-on activities' }
    ]
  },
  'social-studies': {
    title: 'Social Studies',
    duration: '45 minutes',
    learningTheme: 'Critical Thinking',
    domain: 'Civic Education',
    objectives: [
      'Understand social concepts',
      'Develop civic awareness',
      'Analyze social issues',
      'Build cultural understanding'
    ],
    stages: [
      { stage: 'INTRODUCTION', focus: 'Discussion and engagement' },
      { stage: 'PRESENTATION', focus: 'Content exploration' },
      { stage: 'APPLICATION', focus: 'Analysis and discussion' }
    ]
  }
};

const AnglophoneLessonPlanner: React.FC = () => {
  const navigate = useNavigate();
  const { school, user } = useAuth();
  const { uploadFile, getFilesByLesson } = useFileManagement();
  const { isFeatureEnabled } = useFeatureManagement();
  const [showAutoLessonPlanGenerator, setShowAutoLessonPlanGenerator] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<AnglophoneTemplateType>('english-language');
  const [isLoading, setIsLoading] = useState(false);
  const [showFileManager, setShowFileManager] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);
  
  const [lessonPlan, setLessonPlan] = useState<LessonPlan>({
    id: '',
    title: '',
    subject: '',
    class: '',
    date: '',
    time: '',
    duration: '',
    learningTheme: '',
    selectedObjective: '',
    domain: '',
    entryBehaviour: '',
    objectives: [],
    materials: [],
    activities: [],
    stages: [],
    assessmentMethod: '',
    references: '',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [newObjective, setNewObjective] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [newActivity, setNewActivity] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize lesson plan with default template
  useEffect(() => {
    handleTemplateChange(selectedTemplate);
  }, [selectedTemplate]);

  // Handle template change and initialize lesson plan
  const handleTemplateChange = (template: AnglophoneTemplateType) => {
    setSelectedTemplate(template);
    const config = anglophoneTemplateConfigs[template];
    
    setLessonPlan(prev => ({
      ...prev,
      subject: config.title,
      duration: config.duration,
      learningTheme: config.learningTheme,
      domain: config.domain,
      objectives: config.objectives.map((obj, index) => ({
        id: `obj_${Date.now()}_${index}`,
        description: obj,
        completed: false,
        selected: false
      })),
      stages: config.stages.map((stage, index) => ({
        id: `stage_${Date.now()}_${index}`,
        stage: stage.stage,
        content: `Content for ${stage.stage} - ${stage.focus}`,
        facilitatingActivities: `Teacher activities for ${stage.stage}`,
        learningActivities: `Student activities for ${stage.stage}`,
        resources: `Resources needed for ${stage.stage}`
      }))
    }));
  };

  const handleSave = async () => {
    if (!lessonPlan.title || !lessonPlan.subject || !lessonPlan.class) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setIsLoading(true);
      const apiData = lessonService.convertToApiFormat({
        ...lessonPlan,
        system: 'anglophone'
      });
      
      if (lessonPlan.id) {
        // Update existing lesson plan
        await lessonService.updateLessonPlan(lessonPlan.id, apiData);
      } else {
        // Create new lesson plan
        const savedLesson = await lessonService.createLessonPlan(apiData);
        setLessonPlan(prev => ({ ...prev, id: savedLesson.id }));
      }
    } catch (error) {
      console.error('Error saving lesson plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoGeneratedLesson = async (generatedLesson: any) => {
    try {
      setIsLoading(true);
      const apiData = lessonService.convertToApiFormat({
        ...generatedLesson,
        system: 'anglophone'
      });
      
      const savedLesson = await lessonService.createLessonPlan(apiData);
      setLessonPlan(prev => ({ ...savedLesson, ...generatedLesson }));
      setShowAutoLessonPlanGenerator(false);
    } catch (error) {
      console.error('Error saving auto-generated lesson plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      const objective: LearningObjective = {
        id: Date.now().toString(),
        description: newObjective,
        completed: false
      };
      setLessonPlan(prev => ({
        ...prev,
        objectives: [...prev.objectives, objective]
      }));
      setNewObjective('');
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      await uploadFile(file, 'resource', {
        lessonId: lessonPlan.id,
        description: `Resource for lesson: ${lessonPlan.title}`,
        tags: [lessonPlan.subject, lessonPlan.class]
      });
      
      // Refresh attached files
      if (lessonPlan.id) {
        const files = getFilesByLesson(lessonPlan.id);
        setAttachedFiles(files);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    }
  };

  const handleFileRemove = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleFileAttach = (file: any) => {
    setAttachedFiles(prev => [...prev, file]);
    setShowFileManager(false);
  };

  const removeObjective = (id: string) => {
    setLessonPlan(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj.id !== id)
    }));
  };

  const addMaterial = () => {
    if (newMaterial.trim()) {
      const material: Material = {
        id: Date.now().toString(),
        name: newMaterial
      };
      setLessonPlan(prev => ({
        ...prev,
        materials: [...prev.materials, material]
      }));
      setNewMaterial('');
    }
  };

  const removeMaterial = (id: string) => {
    setLessonPlan(prev => ({
      ...prev,
      materials: prev.materials.filter(mat => mat.id !== id)
    }));
  };

  const addActivity = () => {
    if (newActivity.trim()) {
      const activity: Activity = {
        id: Date.now().toString(),
        description: newActivity
      };
      setLessonPlan(prev => ({
        ...prev,
        activities: [...prev.activities, activity]
      }));
      setNewActivity('');
    }
  };

  const removeActivity = (id: string) => {
    setLessonPlan(prev => ({
      ...prev,
      activities: prev.activities.filter(act => act.id !== id)
    }));
  };

  const addStage = () => {
    const stage: LessonStage = {
      id: Date.now().toString(),
      stage: '',
      content: '',
      facilitatingActivities: '',
      learningActivities: '',
      resources: ''
    };
    setLessonPlan(prev => ({
      ...prev,
      stages: [...prev.stages, stage]
    }));
  };

  const updateStage = (id: string, field: keyof LessonStage, value: string) => {
    setLessonPlan(prev => ({
      ...prev,
      stages: prev.stages.map(stage => 
        stage.id === id ? { ...stage, [field]: value } : stage
      )
    }));
  };

  const removeStage = (id: string) => {
    setLessonPlan(prev => ({
      ...prev,
      stages: prev.stages.filter(stage => stage.id !== id)
    }));
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const exportLessonPlan = () => {
    const dataStr = JSON.stringify(lessonPlan, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `anglophone-lesson-plan-${lessonPlan.title || 'untitled'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Lesson plan exported successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportLessonPlan}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Lesson Plan'}
              </button>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Anglophone Lesson Planner</h1>
          <p className="text-gray-600">Create comprehensive English-medium lesson plans with learning objectives and activities</p>
          {school && (
            <div className="mt-2 text-sm text-blue-600">
              <strong>School:</strong> {school.name} ({school.system} system)
            </div>
          )}
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Basic Information
            </h2>
            <button
              onClick={() => setShowAutoLessonPlanGenerator(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              title="Auto-generate lesson plan using AI"
              aria-label="Auto-generate lesson plan"
            >
              <Zap className="h-4 w-4 mr-2" />
              Auto-Generate
            </button>
          </div>

          {/* Template Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Lesson Template *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(anglophoneTemplateConfigs).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleTemplateChange(key as AnglophoneTemplateType)}
                  className={`p-4 rounded-lg border-2 transition-colors text-left ${
                    selectedTemplate === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{config.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{config.learningTheme}</p>
                    <p className="text-xs text-gray-500 mt-1">{config.duration}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Date and Time */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={lessonPlan.date}
                  onChange={(e) => setLessonPlan(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Select date"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={lessonPlan.time}
                  onChange={(e) => setLessonPlan(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Select time"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g., 45 minutes"
                  value={lessonPlan.duration}
                  onChange={(e) => setLessonPlan(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Lesson Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter lesson title"
                  value={lessonPlan.title}
                  onChange={(e) => setLessonPlan(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  value={lessonPlan.subject}
                  onChange={(e) => setLessonPlan(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Select Subject"
                >
                  <option value="">Select Subject</option>
                  <option value="English Language">English Language</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Social Studies">Social Studies</option>
                  <option value="Physical Education">Physical Education</option>
                  <option value="Art">Art</option>
                  <option value="Music">Music</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class *
                </label>
                <select
                  value={lessonPlan.class}
                  onChange={(e) => setLessonPlan(prev => ({ ...prev, class: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Select Class"
                >
                  <option value="">Select Class</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                  <option value="Class 4">Class 4</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 6">Class 6</option>
                </select>
              </div>
            </div>

            {/* Learning Theme and Domain */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Theme *
                </label>
                <select
                  value={lessonPlan.learningTheme}
                  onChange={(e) => setLessonPlan(prev => ({ ...prev, learningTheme: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Select Learning Theme"
                >
                  <option value="">Select Learning Theme</option>
                  <option value="Communication">Communication</option>
                  <option value="Problem Solving">Problem Solving</option>
                  <option value="Critical Thinking">Critical Thinking</option>
                  <option value="Creativity">Creativity</option>
                  <option value="Collaboration">Collaboration</option>
                  <option value="Digital Literacy">Digital Literacy</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Please select a class level first to see available themes</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain
                </label>
                <input
                  type="text"
                  placeholder="e.g., Listening and Speaking, Reading, Writing"
                  value={lessonPlan.domain}
                  onChange={(e) => setLessonPlan(prev => ({ ...prev, domain: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Enter domain"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entry Behaviour
                </label>
                <textarea
                  placeholder="Describe what learners already know or can do..."
                  value={lessonPlan.entryBehaviour}
                  onChange={(e) => setLessonPlan(prev => ({ ...prev, entryBehaviour: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  title="Enter entry behaviour"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-green-600" />
            Learning Objectives
          </h2>
          
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              placeholder="Add a learning objective..."
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyPress={(e) => e.key === 'Enter' && addObjective()}
              title="Enter learning objective"
            />
            <button
              onClick={addObjective}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              title="Add objective"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            {lessonPlan.objectives.map((objective) => (
              <div key={objective.id} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                <input
                  type="checkbox"
                  checked={objective.completed}
                  onChange={(e) => {
                    setLessonPlan(prev => ({
                      ...prev,
                      objectives: prev.objectives.map(obj => 
                        obj.id === objective.id ? { ...obj, completed: e.target.checked } : obj
                      )
                    }));
                  }}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  title="Mark objective as completed"
                />
                <span className={`flex-1 ${objective.completed ? 'line-through text-gray-500' : ''}`}>
                  {objective.description}
                </span>
                <button
                  onClick={() => removeObjective(objective.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Remove objective"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Materials Needed */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
            Materials Needed
          </h2>
          
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              placeholder="Add a material..."
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && addMaterial()}
              title="Enter material"
            />
            <button
              onClick={addMaterial}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              title="Add material"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            {lessonPlan.materials.map((material) => (
              <div key={material.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span>{material.name}</span>
                <button
                  onClick={() => removeMaterial(material.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Remove material"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-orange-600" />
            Activities
          </h2>
          
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              placeholder="Add an activity..."
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              onKeyPress={(e) => e.key === 'Enter' && addActivity()}
              title="Enter activity"
            />
            <button
              onClick={addActivity}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              title="Add activity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            {lessonPlan.activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span>{activity.description}</span>
                <button
                  onClick={() => removeActivity(activity.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Remove activity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* File Attachments - Only show if File Manager feature is enabled */}
        {isFeatureEnabled('File Manager', user?.role || '') && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              File Attachments
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowFileManager(!showFileManager)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Browse Files
              </button>
            </div>
          </div>

          {/* File Upload Component */}
          <div className="mb-4">
            <FileUpload
              onFileUpload={handleFileUpload}
              onFileRemove={handleFileRemove}
              uploadedFiles={attachedFiles}
              category="resource"
              maxFileSize={10}
              acceptedTypes={['image/*', '.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx']}
            />
          </div>

          {/* File Browser Modal */}
          {showFileManager && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">File Browser</h3>
                  <button
                    onClick={() => setShowFileManager(false)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Close file browser"
                    aria-label="Close file browser"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <FileBrowser
                  onFileAttach={handleFileAttach}
                  showAttachButton={true}
                />
              </div>
            </div>
          )}
        </div>
        )}

        {/* Lesson Stages */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Lesson Stages
            </h2>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                Template: <span className="font-medium">{anglophoneTemplateConfigs[selectedTemplate].title}</span>
              </span>
              <button
                onClick={addStage}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Stage
              </button>
            </div>
          </div>
          
          {/* Template Stage Overview */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Template Stage Structure</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {anglophoneTemplateConfigs[selectedTemplate].stages.map((stage, index) => (
                <div key={index} className="text-sm">
                  <div className="font-medium text-blue-800">{stage.stage}</div>
                  <div className="text-blue-600">{stage.focus}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {lessonPlan.stages.map((stage) => (
              <div key={stage.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    placeholder="Stage name (e.g., Introduction, Presentation, Practice)"
                    value={stage.stage}
                    onChange={(e) => updateStage(stage.id, 'stage', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    title="Enter stage name"
                  />
                  <button
                    onClick={() => removeStage(stage.id)}
                    className="ml-2 text-red-600 hover:text-red-800 transition-colors"
                    title="Remove stage"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      placeholder="What will be taught in this stage?"
                      value={stage.content}
                      onChange={(e) => updateStage(stage.id, 'content', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facilitating Activities
                    </label>
                    <textarea
                      placeholder="What will the teacher do?"
                      value={stage.facilitatingActivities}
                      onChange={(e) => updateStage(stage.id, 'facilitatingActivities', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Learning Activities
                    </label>
                    <textarea
                      placeholder="What will the students do?"
                      value={stage.learningActivities}
                      onChange={(e) => updateStage(stage.id, 'learningActivities', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resources
                    </label>
                    <textarea
                      placeholder="What materials/resources are needed?"
                      value={stage.resources}
                      onChange={(e) => updateStage(stage.id, 'resources', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment and References */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Eye className="h-5 w-5 mr-2 text-indigo-600" />
            Assessment & References
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessment Method
              </label>
              <textarea
                placeholder="How will you assess student learning?"
                value={lessonPlan.assessmentMethod}
                onChange={(e) => setLessonPlan(prev => ({ ...prev, assessmentMethod: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                References
              </label>
              <textarea
                placeholder="List any references, textbooks, or resources used"
                value={lessonPlan.references}
                onChange={(e) => setLessonPlan(prev => ({ ...prev, references: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Upload className="h-5 w-5 mr-2 text-gray-600" />
            Attachments
          </h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Upload files, images, or documents related to this lesson</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
              title="Upload files"
              aria-label="Upload lesson files"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Choose Files
            </button>
          </div>
        </div>
      </div>

      {/* Auto Lesson Plan Generator Modal */}
      {showAutoLessonPlanGenerator && (
        <AutoLessonPlanGenerator
          onClose={() => setShowAutoLessonPlanGenerator(false)}
          onSave={handleAutoGeneratedLesson}
        />
      )}
    </div>
  );
};

export default AnglophoneLessonPlanner;
