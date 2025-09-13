import React, { useState } from 'react';
import { FileText, Download, Calendar, Users, TrendingUp, BarChart3, Send, Eye, Edit, CheckCircle, AlertTriangle, Clock, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
// Removed unused imports

interface Student {
  id: string;
  name: string;
  class: string;
  avatar?: string;
}

interface QuizResult {
  id: string;
  quizTitle: string;
  score: number;
  maxScore: number;
  date: Date;
  subject: string;
}

interface MonthlyReport {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  month: string;
  year: number;
  generatedDate: Date;
  status: 'draft' | 'generated' | 'sent';
  teacherNotes?: string;
  shareableLink?: string;
}

interface ReportContent {
  studentInfo: {
    name: string;
    class: string;
  };
  monthlyPerformance: {
    quizzes: QuizResult[];
    averageScore: number;
    totalQuizzes: number;
  };
  progressOverTime: {
    trend: 'improving' | 'declining' | 'stable';
    trendPercentage: number;
  };
  behavioralNotes?: string;
  recommendations: string[];
}

const MonthlyReports: React.FC = () => {
  // Removed unused auth destructuring
  const [activeTab, setActiveTab] = useState<'generate' | 'reports' | 'review'>('generate');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<ReportContent | null>(null);
  const [teacherNotes, setTeacherNotes] = useState('');
  const [editingReport, setEditingReport] = useState<MonthlyReport | null>(null);

  // Mock data - in a real app, this would come from an API
  const mockStudents: Student[] = [
    { id: '1', name: 'Emma Johnson', class: 'Class 1A' },
    { id: '2', name: 'Michael Brown', class: 'Class 1A' },
    { id: '3', name: 'Sophia Davis', class: 'Class 1A' },
    { id: '4', name: 'James Wilson', class: 'Class 1A' },
    { id: '5', name: 'Olivia Miller', class: 'Class 1A' },
  ];

  const mockQuizResults: QuizResult[] = [
    { id: '1', quizTitle: 'Math Basics - Addition', score: 18, maxScore: 20, date: new Date('2024-01-05'), subject: 'Mathematics' },
    { id: '2', quizTitle: 'English Vocabulary', score: 8, maxScore: 10, date: new Date('2024-01-08'), subject: 'English' },
    { id: '3', quizTitle: 'Math Basics - Subtraction', score: 16, maxScore: 20, date: new Date('2024-01-12'), subject: 'Mathematics' },
    { id: '4', quizTitle: 'Science - Animals', score: 7, maxScore: 10, date: new Date('2024-01-15'), subject: 'Science' },
    { id: '5', quizTitle: 'Math Basics - Multiplication', score: 19, maxScore: 20, date: new Date('2024-01-18'), subject: 'Mathematics' },
    { id: '6', quizTitle: 'English Reading', score: 9, maxScore: 10, date: new Date('2024-01-22'), subject: 'English' },
    { id: '7', quizTitle: 'Science - Plants', score: 8, maxScore: 10, date: new Date('2024-01-25'), subject: 'Science' },
  ];

  const mockReports: MonthlyReport[] = [
    {
      id: '1',
      studentId: '1',
      studentName: 'Emma Johnson',
      className: 'Class 1A',
      month: 'January',
      year: 2024,
      generatedDate: new Date('2024-01-30'),
      status: 'sent',
      teacherNotes: 'Emma has shown excellent progress this month. She is very engaged in class and helps other students.',
      shareableLink: 'https://reports.school.com/emma-january-2024'
    },
    {
      id: '2',
      studentId: '2',
      studentName: 'Michael Brown',
      className: 'Class 1A',
      month: 'January',
      year: 2024,
      generatedDate: new Date('2024-01-30'),
      status: 'generated',
      teacherNotes: 'Michael is doing well but could benefit from more practice with multiplication tables.'
    }
  ];

  const getStudentQuizResults = (studentId: string, month: number, year: number): QuizResult[] => {
    // Filter quizzes for the selected month and year
    return mockQuizResults.filter(quiz => {
      const quizDate = new Date(quiz.date);
      return quizDate.getMonth() + 1 === month && quizDate.getFullYear() === year;
    });
  };

  const generateReportContent = (studentId: string, month: number, year: number): ReportContent => {
    const student = mockStudents.find(s => s.id === studentId);
    const quizzes = getStudentQuizResults(studentId, month, year);
    
    const averageScore = quizzes.length > 0 
      ? quizzes.reduce((sum, quiz) => sum + (quiz.score / quiz.maxScore) * 100, 0) / quizzes.length
      : 0;

    // Calculate trend (simplified - compare first half vs second half of month)
    const firstHalf = quizzes.slice(0, Math.ceil(quizzes.length / 2));
    const secondHalf = quizzes.slice(Math.ceil(quizzes.length / 2));
    
    const firstHalfAvg = firstHalf.length > 0 
      ? firstHalf.reduce((sum, quiz) => sum + (quiz.score / quiz.maxScore) * 100, 0) / firstHalf.length
      : 0;
    
    const secondHalfAvg = secondHalf.length > 0 
      ? secondHalf.reduce((sum, quiz) => sum + (quiz.score / quiz.maxScore) * 100, 0) / secondHalf.length
      : 0;

    const trendPercentage = secondHalfAvg - firstHalfAvg;
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    
    if (trendPercentage > 5) trend = 'improving';
    else if (trendPercentage < -5) trend = 'declining';

    // Generate recommendations based on performance
    const recommendations = [];
    if (averageScore < 70) {
      recommendations.push('Consider additional practice sessions for core subjects');
    }
    if (trend === 'declining') {
      recommendations.push('Review study habits and provide extra support');
    }
    if (averageScore >= 85) {
      recommendations.push('Continue current study routine - excellent progress!');
    }
    recommendations.push('Encourage daily reading for 15-20 minutes');
    recommendations.push('Practice math problems for 10 minutes each day');

    return {
      studentInfo: {
        name: student?.name || 'Unknown Student',
        class: student?.class || 'Unknown Class'
      },
      monthlyPerformance: {
        quizzes,
        averageScore,
        totalQuizzes: quizzes.length
      },
      progressOverTime: {
        trend,
        trendPercentage
      },
      behavioralNotes: teacherNotes,
      recommendations
    };
  };

  const generateReport = () => {
    if (!selectedStudent) {
      toast.error('Please select a student');
      return;
    }

    const reportContent = generateReportContent(selectedStudent, selectedMonth, selectedYear);
    setPreviewData(reportContent);
    setShowPreview(true);
    toast.success('Report generated successfully!');
  };

  const sendReport = (reportId: string) => {
    // Simulate sending report
    toast.success('Report sent to parents successfully!');
    
    // Update report status
    const report = mockReports.find(r => r.id === reportId);
    if (report) {
      report.status = 'sent';
      report.shareableLink = `https://reports.school.com/${report.studentName.toLowerCase().replace(' ', '-')}-${report.month.toLowerCase()}-${report.year}`;
    }
  };

  const downloadReport = () => {
    toast.success('Report downloaded as PDF!');
  };

  const shareReport = (reportId: string) => {
    const report = mockReports.find(r => r.id === reportId);
    if (report && report.shareableLink) {
      navigator.clipboard.writeText(report.shareableLink);
      toast.success('Shareable link copied to clipboard!');
    }
  };

  const editReport = (report: MonthlyReport) => {
    setEditingReport(report);
    setTeacherNotes(report.teacherNotes || '');
    setActiveTab('review');
  };

  const saveReport = () => {
    if (editingReport) {
      editingReport.teacherNotes = teacherNotes;
      setEditingReport(null);
      setTeacherNotes('');
      toast.success('Report updated successfully!');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'generated':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'draft':
        return <Edit className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Monthly Report Generator</h1>
            <p className="text-gray-600">Automated monthly progress reports with one-click distribution</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('generate')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'generate'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="inline-block w-4 h-4 mr-2" />
              Generate Report
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="inline-block w-4 h-4 mr-2" />
              Generated Reports
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'review'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Eye className="inline-block w-4 h-4 mr-2" />
              Review & Edit
            </button>
          </nav>
        </div>
      </div>

      {/* Generate Report Tab */}
      {activeTab === 'generate' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate Monthly Report</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Student Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a student...</option>
                  {mockStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.class})
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 3 }, (_, i) => (
                    <option key={i} value={new Date().getFullYear() - 1 + i}>
                      {new Date().getFullYear() - 1 + i}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={generateReport}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-2"
              >
                <FileText size={16} />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generated Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Generated Reports</h2>
            <div className="text-sm text-gray-600">
              {mockReports.length} reports generated
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockReports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{report.studentName}</h3>
                    <p className="text-sm text-gray-600">{report.className} • {report.month} {report.year}</p>
                    <p className="text-xs text-gray-500">
                      Generated: {report.generatedDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(report.status)}
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {report.status}
                    </span>
                  </div>
                </div>

                {report.teacherNotes && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">{report.teacherNotes}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => editReport(report)}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center space-x-1"
                  >
                    <Eye size={16} />
                    <span>Review</span>
                  </button>
                  
                  {report.status === 'generated' && (
                    <button
                      onClick={() => sendReport(report.id)}
                      className="flex-1 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center justify-center space-x-1"
                    >
                      <Send size={16} />
                      <span>Send</span>
                    </button>
                  )}
                  
                  {report.shareableLink && (
                    <button
                      onClick={() => shareReport(report.id)}
                      className="flex-1 px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center justify-center space-x-1"
                    >
                      <Share2 size={16} />
                      <span>Share</span>
                    </button>
                  )}
                  
                  <button
                    onClick={downloadReport}
                    className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center justify-center space-x-1"
                  >
                    <Download size={16} />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review & Edit Tab */}
      {activeTab === 'review' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Review & Edit Report</h2>
            
            {editingReport ? (
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Report Details</h3>
                  <p className="text-sm text-gray-600">
                    {editingReport.studentName} • {editingReport.className} • {editingReport.month} {editingReport.year}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teacher Notes (Optional)
                  </label>
                  <textarea
                    value={teacherNotes}
                    onChange={(e) => setTeacherNotes(e.target.value)}
                    placeholder="Add a personal note about the student's effort, participation, or behavior..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This note will be included in the report sent to parents
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setEditingReport(null);
                      setTeacherNotes('');
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveReport}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Report Selected</h3>
                <p className="text-gray-600">Select a report from the "Generated Reports" tab to review and edit</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Report Preview Modal */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Monthly Progress Report</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              {/* Report Content */}
              <div className="space-y-6">
                {/* Student Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Student Information</h3>
                  <p className="text-blue-800">
                    <strong>Name:</strong> {previewData.studentInfo.name}<br />
                    <strong>Class:</strong> {previewData.studentInfo.class}
                  </p>
                </div>

                {/* Monthly Performance Summary */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance Summary</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(previewData.monthlyPerformance.averageScore)}%
                      </div>
                      <div className="text-sm text-green-600">Average Score</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {previewData.monthlyPerformance.totalQuizzes}
                      </div>
                      <div className="text-sm text-blue-600">Total Quizzes</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-center space-x-1">
                        {getTrendIcon(previewData.progressOverTime.trend)}
                        <span className="text-lg font-bold text-purple-600">
                          {previewData.progressOverTime.trendPercentage > 0 ? '+' : ''}
                          {Math.round(previewData.progressOverTime.trendPercentage)}%
                        </span>
                      </div>
                      <div className="text-sm text-purple-600">Trend</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Quiz Results:</h4>
                    {previewData.monthlyPerformance.quizzes.map((quiz) => (
                      <div key={quiz.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{quiz.quizTitle}</span>
                          <span className="text-sm text-gray-600 ml-2">({quiz.subject})</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            {Math.round((quiz.score / quiz.maxScore) * 100)}%
                          </div>
                          <div className="text-sm text-gray-500">{quiz.score}/{quiz.maxScore}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Over Time */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Over Time</h3>
                  <div className="flex items-center space-x-4">
                    {getTrendIcon(previewData.progressOverTime.trend)}
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {previewData.progressOverTime.trend} Performance
                      </p>
                      <p className="text-sm text-gray-600">
                        {previewData.progressOverTime.trendPercentage > 0 ? 'Improved by' : 
                         previewData.progressOverTime.trendPercentage < 0 ? 'Declined by' : 'Stable performance'}
                        {Math.abs(Math.round(previewData.progressOverTime.trendPercentage))}% this month
                      </p>
                    </div>
                  </div>
                </div>

                {/* Behavioral & Participation Notes */}
                {previewData.behavioralNotes && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Teacher Notes</h3>
                    <p className="text-gray-700">{previewData.behavioralNotes}</p>
                  </div>
                )}

                {/* Actionable Recommendations */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations for Parents</h3>
                  <ul className="space-y-2">
                    {previewData.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  onClick={downloadReport}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-2"
                >
                  <Download size={16} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyReports;