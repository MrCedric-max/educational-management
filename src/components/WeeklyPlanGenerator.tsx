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
  X,
  Link
} from 'lucide-react';
import { useAnglophoneCurriculum } from '../contexts/AnglophoneCurriculumContext';
import toast from 'react-hot-toast';

interface WeeklyPlanGeneratorProps {
  onClose: () => void;
  onSave: (plan: any) => void;
  selectedScheme?: any;
}

const WeeklyPlanGenerator: React.FC<WeeklyPlanGeneratorProps> = ({ onClose, onSave, selectedScheme }) => {
  const { getLevels, getSubjects, getSchemesForSubject } = useAnglophoneCurriculum();
  
  const [plan, setPlan] = useState({
    subjectId: selectedScheme?.subjectId || '',
    levelId: selectedScheme?.levelId || '',
    term: selectedScheme?.term || 1,
    week: selectedScheme?.week || 1,
    theme: '',
    subThemes: [''],
    learningOutcomes: [''],
    crossCurricularLinks: [''],
    differentiation: [''],
    homework: [''],
    notes: '',
    schemeOfWorkId: selectedScheme?.id || ''
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const levels = getLevels();
  const subjects = getSubjects();
  const schemes = plan.subjectId && plan.levelId ? getSchemesForSubject(plan.subjectId, plan.levelId) : [];

  const addSubTheme = () => {
    setPlan(prev => ({
      ...prev,
      subThemes: [...prev.subThemes, '']
    }));
  };

  const updateSubTheme = (index: number, value: string) => {
    setPlan(prev => ({
      ...prev,
      subThemes: prev.subThemes.map((theme, i) => i === index ? value : theme)
    }));
  };

  const removeSubTheme = (index: number) => {
    setPlan(prev => ({
      ...prev,
      subThemes: prev.subThemes.filter((_, i) => i !== index)
    }));
  };

  const addLearningOutcome = () => {
    setPlan(prev => ({
      ...prev,
      learningOutcomes: [...prev.learningOutcomes, '']
    }));
  };

  const updateLearningOutcome = (index: number, value: string) => {
    setPlan(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.map((outcome, i) => i === index ? value : outcome)
    }));
  };

  const removeLearningOutcome = (index: number) => {
    setPlan(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== index)
    }));
  };

  const addCrossCurricularLink = () => {
    setPlan(prev => ({
      ...prev,
      crossCurricularLinks: [...prev.crossCurricularLinks, '']
    }));
  };

  const updateCrossCurricularLink = (index: number, value: string) => {
    setPlan(prev => ({
      ...prev,
      crossCurricularLinks: prev.crossCurricularLinks.map((link, i) => i === index ? value : link)
    }));
  };

  const removeCrossCurricularLink = (index: number) => {
    setPlan(prev => ({
      ...prev,
      crossCurricularLinks: prev.crossCurricularLinks.filter((_, i) => i !== index)
    }));
  };

  const addDifferentiation = () => {
    setPlan(prev => ({
      ...prev,
      differentiation: [...prev.differentiation, '']
    }));
  };

  const updateDifferentiation = (index: number, value: string) => {
    setPlan(prev => ({
      ...prev,
      differentiation: prev.differentiation.map((item, i) => i === index ? value : item)
    }));
  };

  const removeDifferentiation = (index: number) => {
    setPlan(prev => ({
      ...prev,
      differentiation: prev.differentiation.filter((_, i) => i !== index)
    }));
  };

  const addHomework = () => {
    setPlan(prev => ({
      ...prev,
      homework: [...prev.homework, '']
    }));
  };

  const updateHomework = (index: number, value: string) => {
    setPlan(prev => ({
      ...prev,
      homework: prev.homework.map((item, i) => i === index ? value : item)
    }));
  };

  const removeHomework = (index: number) => {
    setPlan(prev => ({
      ...prev,
      homework: prev.homework.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (!plan.subjectId || !plan.levelId || !plan.theme) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newPlan = {
      ...plan,
      id: `generated-plan-${Date.now()}`,
      subThemes: plan.subThemes.filter(theme => theme.trim()),
      learningOutcomes: plan.learningOutcomes.filter(outcome => outcome.trim()),
      crossCurricularLinks: plan.crossCurricularLinks.filter(link => link.trim()),
      differentiation: plan.differentiation.filter(item => item.trim()),
      homework: plan.homework.filter(item => item.trim())
    };

    onSave(newPlan);
    toast.success('Weekly plan generated successfully!');
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Auto-generate some content based on the theme
    if (plan.theme) {
      setPlan(prev => ({
        ...prev,
        subThemes: [
          `Introduction to ${plan.theme}`,
          `Key concepts of ${plan.theme}`,
          `Practical applications of ${plan.theme}`
        ],
        learningOutcomes: [
          `Students will understand the concept of ${plan.theme}`,
          `Students will apply knowledge of ${plan.theme} in real situations`,
          `Students will demonstrate mastery of ${plan.theme}`
        ],
        crossCurricularLinks: [
          'Mathematics: Data analysis and calculations',
          'Science: Scientific method and observation',
          'Social Studies: Historical context and impact'
        ],
        differentiation: [
          'Advanced learners: Extended research projects',
          'Struggling learners: Simplified activities with extra support',
          'Visual learners: Charts, diagrams, and visual aids'
        ],
        homework: [
          `Research assignment on ${plan.theme}`,
          'Practice exercises and worksheets',
          'Reflection journal entry'
        ]
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
            <h2 className="text-2xl font-bold text-gray-900">Generate Weekly Plan</h2>
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
                  value={plan.levelId}
                  onChange={(e) => setPlan(prev => ({ ...prev, levelId: e.target.value }))}
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
                  value={plan.subjectId}
                  onChange={(e) => setPlan(prev => ({ ...prev, subjectId: e.target.value }))}
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
                  value={plan.term}
                  onChange={(e) => setPlan(prev => ({ ...prev, term: parseInt(e.target.value) }))}
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
                  value={plan.week}
                  onChange={(e) => setPlan(prev => ({ ...prev, week: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: 13 }, (_, i) => i + 1).map(week => (
                    <option key={week} value={week}>Week {week}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link to Scheme of Work
                </label>
                <select
                  value={plan.schemeOfWorkId}
                  onChange={(e) => setPlan(prev => ({ ...prev, schemeOfWorkId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Scheme of Work</option>
                  {schemes.map(scheme => (
                    <option key={scheme.id} value={scheme.id}>
                      {scheme.topic} (Term {scheme.term}, Week {scheme.week})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme *
              </label>
              <input
                type="text"
                value={plan.theme}
                onChange={(e) => setPlan(prev => ({ ...prev, theme: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the weekly theme"
              />
            </div>

            {/* Sub-Themes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Sub-Themes
                </label>
                <button
                  onClick={addSubTheme}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {plan.subThemes.map((subTheme, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={subTheme}
                      onChange={(e) => updateSubTheme(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter sub-theme"
                    />
                    <button
                      onClick={() => removeSubTheme(index)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Outcomes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Learning Outcomes
                </label>
                <button
                  onClick={addLearningOutcome}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {plan.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={outcome}
                      onChange={(e) => updateLearningOutcome(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter learning outcome"
                    />
                    <button
                      onClick={() => removeLearningOutcome(index)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cross-Curricular Links */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Cross-Curricular Links
                </label>
                <button
                  onClick={addCrossCurricularLink}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {plan.crossCurricularLinks.map((link, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={link}
                      onChange={(e) => updateCrossCurricularLink(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter cross-curricular link"
                    />
                    <button
                      onClick={() => removeCrossCurricularLink(index)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Differentiation */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Differentiation Strategies
                </label>
                <button
                  onClick={addDifferentiation}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {plan.differentiation.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateDifferentiation(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter differentiation strategy"
                    />
                    <button
                      onClick={() => removeDifferentiation(index)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Homework */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Homework Assignments
                </label>
                <button
                  onClick={addHomework}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {plan.homework.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateHomework(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter homework assignment"
                    />
                    <button
                      onClick={() => removeHomework(index)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={plan.notes}
                onChange={(e) => setPlan(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter any additional notes or considerations for this weekly plan"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !plan.theme}
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
                Save Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlanGenerator;





