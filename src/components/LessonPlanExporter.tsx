import React, { useState } from 'react';
import { Download, FileText, Calendar, BookOpen, Settings, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  grade: string;
  duration: number;
  objectives: string[];
  materials: string[];
  activities: Array<{
    name: string;
    description: string;
    duration: number;
  }>;
  assessmentMethods: string[];
  notes: string;
  createdAt: Date;
}

interface LessonPlanExporterProps {
  lessonPlans: LessonPlan[];
  onExport?: (format: string, selectedPlans: LessonPlan[]) => void;
}

const LessonPlanExporter: React.FC<LessonPlanExporterProps> = ({
  lessonPlans,
  onExport
}) => {
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<string>('PDF');
  const [includeImages, setIncludeImages] = useState(false);
  const [includeObjectives, setIncludeObjectives] = useState(true);
  const [includeMaterials, setIncludeMaterials] = useState(true);
  const [includeActivities, setIncludeActivities] = useState(true);
  const [includeAssessment, setIncludeAssessment] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const formats = [
    { id: 'PDF', name: 'PDF Document', icon: <FileText className="h-5 w-5" /> },
    { id: 'Word', name: 'Word Document', icon: <FileText className="h-5 w-5" /> },
    { id: 'HTML', name: 'Web Page', icon: <BookOpen className="h-5 w-5" /> }
  ];

  const handleSelectAll = () => {
    if (selectedPlans.length === lessonPlans.length) {
      setSelectedPlans([]);
    } else {
      setSelectedPlans(lessonPlans.map(plan => plan.id));
    }
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlans(prev => 
      prev.includes(planId) 
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  };

  const handleExport = async () => {
    if (selectedPlans.length === 0) {
      toast.error('Please select at least one lesson plan to export');
      return;
    }

    setIsExporting(true);

    try {
      const selectedLessonPlans = lessonPlans.filter(plan => selectedPlans.includes(plan.id));
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (onExport) {
        onExport(exportFormat, selectedLessonPlans);
      }

      toast.success(`${selectedPlans.length} lesson plan(s) exported as ${exportFormat}`);
    } catch (error) {
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const generatePreview = () => {
    const selectedLessonPlans = lessonPlans.filter(plan => selectedPlans.includes(plan.id));
    
    if (selectedLessonPlans.length === 0) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
        <h4 className="font-semibold text-gray-900 mb-3">Export Preview</h4>
        <div className="space-y-3">
          {selectedLessonPlans.map((plan) => (
            <div key={plan.id} className="bg-white rounded p-3 border">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-gray-900">{plan.title}</h5>
                  <p className="text-sm text-gray-600">{plan.subject} • Grade {plan.grade} • {plan.duration} min</p>
                </div>
                <div className="text-sm text-gray-500">
                  {plan.objectives.length} objectives
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Export Lesson Plans</h3>
          <p className="text-sm text-gray-600">Select lesson plans and configure export options</p>
        </div>
        <Calendar className="h-8 w-8 text-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lesson Plan Selection */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Select Lesson Plans</h4>
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {selectedPlans.length === lessonPlans.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
            {lessonPlans.map((plan) => (
              <label key={plan.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                <input
                  type="checkbox"
                  checked={selectedPlans.includes(plan.id)}
                  onChange={() => handleSelectPlan(plan.id)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{plan.title}</div>
                  <div className="text-sm text-gray-600">
                    {plan.subject} • Grade {plan.grade} • {plan.duration} min
                  </div>
                  <div className="text-xs text-gray-500">
                    {plan.objectives.length} objectives • {plan.activities.length} activities
                  </div>
                </div>
              </label>
            ))}
          </div>

          {selectedPlans.length > 0 && (
            <div className="mt-3 text-sm text-gray-600">
              {selectedPlans.length} of {lessonPlans.length} lesson plans selected
            </div>
          )}
        </div>

        {/* Export Configuration */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Export Configuration</h4>
          
          {/* Format Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="space-y-2">
              {formats.map((format) => (
                <label key={format.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="format"
                    value={format.id}
                    checked={exportFormat === format.id}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    {format.icon}
                    <span className="text-sm font-medium text-gray-900">{format.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Content Options */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Include Content
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeObjectives}
                  onChange={(e) => setIncludeObjectives(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Learning Objectives</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeMaterials}
                  onChange={(e) => setIncludeMaterials(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Materials & Resources</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeActivities}
                  onChange={(e) => setIncludeActivities(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Activities & Procedures</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeAssessment}
                  onChange={(e) => setIncludeAssessment(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Assessment Methods</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeNotes}
                  onChange={(e) => setIncludeNotes(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Teacher Notes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeImages}
                  onChange={(e) => setIncludeImages(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Images & Diagrams</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      {selectedPlans.length > 0 && (
        <div className="mt-6">
          {generatePreview()}
        </div>
      )}

      {/* Export Button */}
      <div className="mt-6 pt-4 border-t">
        <button
          onClick={handleExport}
          disabled={selectedPlans.length === 0 || isExporting}
          className="w-full px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              <span>Export {selectedPlans.length} Lesson Plan(s)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LessonPlanExporter;
