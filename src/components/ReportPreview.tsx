import React from 'react';
import { X, Download, Printer, TrendingUp, TrendingDown, BarChart3, Calendar, Users, Target, Award } from 'lucide-react';

interface ReportData {
  academicProgress: {
    subjects: Array<{
      name: string;
      progress: number;
      assessments: number;
      averageScore: number;
      trends: 'up' | 'down' | 'stable';
    }>;
    overallAverage: number;
    improvement: number;
  };
  attendance: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    tardyDays: number;
    percentage: number;
  };
  behavior: {
    positiveIncidents: number;
    negativeIncidents: number;
    overallScore: number;
    improvements: string[];
    concerns: string[];
  };
  achievements: Array<{
    title: string;
    date: Date;
    description: string;
    category: 'academic' | 'behavioral' | 'extracurricular';
  }>;
  goals: Array<{
    title: string;
    target: string;
    progress: number;
    status: 'on-track' | 'needs-attention' | 'completed';
  }>;
  recommendations: string[];
  nextMonthFocus: string[];
}

interface ReportPreviewProps {
  data: ReportData;
  reportType: 'student' | 'class' | 'school';
  month: number;
  year: number;
  onClose: () => void;
  onDownload: () => void;
  onPrint: () => void;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  data,
  reportType,
  month,
  year,
  onClose,
  onDownload,
  onPrint
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'on-track':
        return 'bg-blue-100 text-blue-800';
      case 'needs-attention':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'behavioral':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'extracurricular':
        return <Award className="h-4 w-4 text-purple-500" />;
      default:
        return <Award className="h-4 w-4 text-gray-500" />;
    }
  };

  const monthName = new Date(0, month - 1).toLocaleString('default', { month: 'long' });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Monthly Report Preview - {monthName} {year}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onDownload}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-md"
              title="Download Report"
            >
              <Download size={20} />
            </button>
            <button
              onClick={onPrint}
              className="p-2 text-green-500 hover:bg-green-50 rounded-md"
              title="Print Report"
            >
              <Printer size={20} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Report Header */}
          <div className="text-center border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Monthly Progress Report
            </h1>
            <p className="text-lg text-gray-600">
              {monthName} {year} • {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Generated on {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Academic Progress Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-6 w-6 mr-2 text-blue-600" />
              Academic Progress
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Overall Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overall Average:</span>
                    <span className="font-semibold text-gray-900">{data.academicProgress.overallAverage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Improvement:</span>
                    <span className="font-semibold text-green-600">+{data.academicProgress.improvement}%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Subject Breakdown</h3>
                <div className="space-y-2">
                  {data.academicProgress.subjects.map((subject, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-600">{subject.name}:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">{subject.progress}%</span>
                        {getTrendIcon(subject.trends)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Subject Performance */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Subject Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Subject</th>
                      <th className="text-left py-2">Progress</th>
                      <th className="text-left py-2">Assessments</th>
                      <th className="text-left py-2">Average Score</th>
                      <th className="text-left py-2">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.academicProgress.subjects.map((subject, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 font-medium">{subject.name}</td>
                        <td className="py-2">{subject.progress}%</td>
                        <td className="py-2">{subject.assessments}</td>
                        <td className="py-2">{subject.averageScore}%</td>
                        <td className="py-2">
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(subject.trends)}
                            <span className="text-sm capitalize">{subject.trends}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Attendance Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-green-600" />
              Attendance Record
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{data.attendance.percentage}%</div>
                <div className="text-sm text-gray-600">Attendance Rate</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{data.attendance.presentDays}</div>
                <div className="text-sm text-gray-600">Days Present</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{data.attendance.absentDays}</div>
                <div className="text-sm text-gray-600">Days Absent</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{data.attendance.tardyDays}</div>
                <div className="text-sm text-gray-600">Days Tardy</div>
              </div>
            </div>
          </div>

          {/* Behavior Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2 text-purple-600" />
              Behavior Assessment
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Behavior Score</h3>
                <div className="text-3xl font-bold text-gray-900 mb-2">{data.behavior.overallScore}/100</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${data.behavior.overallScore}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Incidents</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-600">Positive:</span>
                    <span className="font-semibold">{data.behavior.positiveIncidents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Negative:</span>
                    <span className="font-semibold">{data.behavior.negativeIncidents}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Improvements</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {data.behavior.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="h-6 w-6 mr-2 text-yellow-600" />
              Achievements & Recognition
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.achievements.map((achievement, index) => (
                <div key={index} className="bg-white rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    {getCategoryIcon(achievement.category)}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {achievement.date.toLocaleDateString()} • {achievement.category}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goals Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-6 w-6 mr-2 text-blue-600" />
              Goals & Progress
            </h2>
            
            <div className="space-y-4">
              {data.goals.map((goal, index) => (
                <div key={index} className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{goal.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                      {goal.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Target: {goal.target}</p>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{goal.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Teacher Recommendations</h2>
            <div className="bg-white rounded-lg p-4">
              <ul className="space-y-2">
                {data.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Next Month Focus Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Next Month Focus Areas</h2>
            <div className="bg-white rounded-lg p-4">
              <ul className="space-y-2">
                {data.nextMonthFocus.map((focus, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">→</span>
                    <span className="text-gray-700">{focus}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
