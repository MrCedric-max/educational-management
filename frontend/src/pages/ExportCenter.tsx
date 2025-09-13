import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileImage, Calendar, Users, BookOpen, BarChart3, Settings, Filter, CheckCircle, Clock, ArrowLeft, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ExportOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  formats: string[];
  category: 'reports' | 'lesson-plans' | 'data' | 'analytics';
}

interface ExportJob {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  format: string;
  size?: string;
  createdAt: Date;
  completedAt?: Date;
}

const ExportCenter: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<'reports' | 'lesson-plans' | 'data' | 'analytics'>('reports');
  const [selectedExport, setSelectedExport] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<string>('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeImages, setIncludeImages] = useState(false);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);

  const exportOptions: ExportOption[] = [
    {
      id: 'monthly-reports',
      name: 'Monthly Progress Reports',
      description: 'Comprehensive monthly reports for students, classes, or school-wide',
      icon: <FileText className="h-6 w-6" />,
      formats: ['PDF', 'Excel', 'Word'],
      category: 'reports'
    },
    {
      id: 'attendance-reports',
      name: 'Attendance Reports',
      description: 'Detailed attendance tracking and analysis reports',
      icon: <Calendar className="h-6 w-6" />,
      formats: ['PDF', 'Excel', 'CSV'],
      category: 'reports'
    },
    {
      id: 'behavior-reports',
      name: 'Behavior Reports',
      description: 'Student behavior tracking and incident reports',
      icon: <Users className="h-6 w-6" />,
      formats: ['PDF', 'Excel'],
      category: 'reports'
    },
    {
      id: 'academic-progress',
      name: 'Academic Progress Reports',
      description: 'Subject-wise academic performance and progress tracking',
      icon: <BarChart3 className="h-6 w-6" />,
      formats: ['PDF', 'Excel', 'Word'],
      category: 'reports'
    },
    {
      id: 'lesson-plans',
      name: 'Lesson Plans',
      description: 'Export lesson plans in various formats for sharing and printing',
      icon: <BookOpen className="h-6 w-6" />,
      formats: ['PDF', 'Word', 'HTML'],
      category: 'lesson-plans'
    },
    {
      id: 'curriculum-maps',
      name: 'Curriculum Maps',
      description: 'Subject curriculum mapping and scope & sequence documents',
      icon: <FileSpreadsheet className="h-6 w-6" />,
      formats: ['Excel', 'PDF', 'CSV'],
      category: 'lesson-plans'
    },
    {
      id: 'student-data',
      name: 'Student Data Export',
      description: 'Complete student information and records export',
      icon: <Users className="h-6 w-6" />,
      formats: ['Excel', 'CSV', 'JSON'],
      category: 'data'
    },
    {
      id: 'class-rosters',
      name: 'Class Rosters',
      description: 'Class enrollment and student roster information',
      icon: <FileText className="h-6 w-6" />,
      formats: ['Excel', 'PDF', 'CSV'],
      category: 'data'
    },
    {
      id: 'progress-analytics',
      name: 'Progress Analytics',
      description: 'Data analytics and insights for progress tracking',
      icon: <BarChart3 className="h-6 w-6" />,
      formats: ['Excel', 'CSV', 'PDF'],
      category: 'analytics'
    },
    {
      id: 'performance-charts',
      name: 'Performance Charts',
      description: 'Visual charts and graphs for performance analysis',
      icon: <FileImage className="h-6 w-6" />,
      formats: ['PNG', 'JPG', 'PDF', 'SVG'],
      category: 'analytics'
    }
  ];

  const mockClasses = ['3A', '3B', '4A', '4B', '5A', '5B'];
  const mockStudents = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown'];

  const categories = [
    { id: 'reports', name: 'Reports', icon: <FileText className="h-5 w-5" /> },
    { id: 'lesson-plans', name: 'Lesson Plans', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'data', name: 'Data Export', icon: <FileSpreadsheet className="h-5 w-5" /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 className="h-5 w-5" /> }
  ] as const;

  const filteredOptions = exportOptions.filter(option => option.category === activeCategory);

  const handleExport = () => {
    if (!selectedExport || !exportFormat) {
      toast.error('Please select an export option and format');
      return;
    }

    const exportOption = exportOptions.find(opt => opt.id === selectedExport);
    if (!exportOption) return;

    // Create export job
    const newJob: ExportJob = {
      id: Date.now().toString(),
      name: `${exportOption.name} (${exportFormat})`,
      status: 'pending',
      progress: 0,
      format: exportFormat,
      createdAt: new Date()
    };

    setExportJobs(prev => [newJob, ...prev]);
    toast.success('Export job started');

    // Simulate export process
    simulateExport(newJob.id);
  };

  const simulateExport = (jobId: string) => {
    const interval = setInterval(() => {
      setExportJobs(prev => prev.map(job => {
        if (job.id === jobId) {
          if (job.progress < 100) {
            return {
              ...job,
              status: 'processing',
              progress: Math.min(job.progress + Math.random() * 20, 100)
            };
          } else {
            clearInterval(interval);
            return {
              ...job,
              status: 'completed',
              progress: 100,
              completedAt: new Date(),
              size: `${(Math.random() * 5 + 1).toFixed(1)} MB`
            };
          }
        }
        return job;
      }));
    }, 500);
  };

  const downloadExport = (job: ExportJob) => {
    if (job.status === 'completed') {
      toast.success(`Downloading ${job.name}`);
      // In a real app, this would trigger the actual download
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <div className="h-4 w-4 bg-red-500 rounded-full" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Export Center</h1>
            <p className="text-gray-600">Export reports, lesson plans, and data in various formats</p>
          </div>
          <div className="flex items-center space-x-4">
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Options */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Tabs */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeCategory === category.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setSelectedExport(option.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedExport === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        selectedExport === option.id ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{option.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {option.formats.map((format) => (
                            <span
                              key={format}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                            >
                              {format}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Export Configuration */}
          {selectedExport && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Configuration</h3>
              
              <div className="space-y-6">
                {/* Format Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Format
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {exportOptions.find(opt => opt.id === selectedExport)?.formats.map((format) => (
                      <button
                        key={format}
                        onClick={() => setExportFormat(format)}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          exportFormat === format
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{format}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Class Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Classes
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {mockClasses.map((className) => (
                      <label key={className} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedClasses.includes(className)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedClasses(prev => [...prev, className]);
                            } else {
                              setSelectedClasses(prev => prev.filter(c => c !== className));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{className}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Student Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Students (Optional)
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {mockStudents.map((student) => (
                      <label key={student} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudents(prev => [...prev, student]);
                            } else {
                              setSelectedStudents(prev => prev.filter(s => s !== student));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{student}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Options */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Additional Options</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={includeCharts}
                        onChange={(e) => setIncludeCharts(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Include charts and graphs</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={includeImages}
                        onChange={(e) => setIncludeImages(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Include images and photos</span>
                    </label>
                  </div>
                </div>

                {/* Export Button */}
                <div className="pt-4 border-t">
                  <button
                    onClick={handleExport}
                    disabled={!exportFormat}
                    className="w-full px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Download className="h-5 w-5" />
                    <span>Start Export</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Export Jobs */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Jobs</h3>
            
            {exportJobs.length === 0 ? (
              <div className="text-center py-8">
                <Download className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No export jobs yet</p>
                <p className="text-sm text-gray-400">Start an export to see progress here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {exportJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(job.status)}
                        <span className="font-medium text-sm text-gray-900">{job.name}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                    
                    {job.status === 'processing' && (
                      <div className="mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${job.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{job.progress.toFixed(0)}% complete</div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{job.createdAt.toLocaleTimeString()}</span>
                      {job.status === 'completed' && (
                        <button
                          onClick={() => downloadExport(job)}
                          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        >
                          <Download className="h-3 w-3" />
                          <span>Download</span>
                        </button>
                      )}
                    </div>
                    
                    {job.size && (
                      <div className="text-xs text-gray-500 mt-1">Size: {job.size}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Export Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setSelectedExport('monthly-reports');
                  setExportFormat('PDF');
                  toast.success('Quick export configured');
                }}
                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium text-sm">Monthly Report (PDF)</div>
                    <div className="text-xs text-gray-500">Current month data</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  setSelectedExport('class-rosters');
                  setExportFormat('Excel');
                  toast.success('Quick export configured');
                }}
                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium text-sm">Class Rosters (Excel)</div>
                    <div className="text-xs text-gray-500">All classes</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  setSelectedExport('lesson-plans');
                  setExportFormat('PDF');
                  toast.success('Quick export configured');
                }}
                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="font-medium text-sm">Lesson Plans (PDF)</div>
                    <div className="text-xs text-gray-500">Current week</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportCenter;
