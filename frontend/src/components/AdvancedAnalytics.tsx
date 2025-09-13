import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  HelpCircle,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  Target,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRealtime } from '../contexts/RealtimeContext';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalLessons: number;
  completedLessons: number;
  totalQuizzes: number;
  completedQuizzes: number;
  totalContent: number;
  systemUptime: number;
  performanceScore: number;
  engagementRate: number;
  errorRate: number;
  responseTime: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

interface TimeRange {
  label: string;
  value: string;
  days: number;
}

const AdvancedAnalytics: React.FC = () => {
  const { user, school } = useAuth();
  const { stats } = useRealtime();
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>({
    label: 'Last 7 Days',
    value: '7d',
    days: 7
  });
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');
  const [showDetails, setShowDetails] = useState<boolean>(true);

  // Mock analytics data - in a real app, this would come from an API
  const analyticsData: AnalyticsData = useMemo(() => ({
    totalUsers: 1247,
    activeUsers: 892,
    totalLessons: 3456,
    completedLessons: 2891,
    totalQuizzes: 1234,
    completedQuizzes: 987,
    totalContent: 5678,
    systemUptime: 99.8,
    performanceScore: 94.2,
    engagementRate: 78.5,
    errorRate: 0.2,
    responseTime: 245
  }), []);

  const timeRanges: TimeRange[] = [
    { label: 'Last 24 Hours', value: '1d', days: 1 },
    { label: 'Last 7 Days', value: '7d', days: 7 },
    { label: 'Last 30 Days', value: '30d', days: 30 },
    { label: 'Last 90 Days', value: '90d', days: 90 },
    { label: 'Last Year', value: '1y', days: 365 }
  ];

  const metrics = [
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'blue' },
    { id: 'users', label: 'Users', icon: Users, color: 'green' },
    { id: 'lessons', label: 'Lessons', icon: BookOpen, color: 'purple' },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle, color: 'orange' },
    { id: 'performance', label: 'Performance', icon: TrendingUp, color: 'red' },
    { id: 'engagement', label: 'Engagement', icon: Target, color: 'indigo' }
  ];

  // Generate mock chart data based on selected time range
  const generateChartData = (type: string): ChartData => {
    const days = selectedTimeRange.days;
    const labels = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const generateData = (base: number, variance: number = 0.3) => 
      Array.from({ length: days }, () => 
        Math.floor(base * (1 + (Math.random() - 0.5) * variance))
      );

    switch (type) {
      case 'users':
        return {
          labels,
          datasets: [{
            label: 'Active Users',
            data: generateData(analyticsData.activeUsers / days, 0.4),
            backgroundColor: ['rgba(34, 197, 94, 0.2)'],
            borderColor: ['rgba(34, 197, 94, 1)'],
            borderWidth: 2
          }]
        };
      case 'lessons':
        return {
          labels,
          datasets: [{
            label: 'Lessons Created',
            data: generateData(analyticsData.totalLessons / days, 0.5),
            backgroundColor: ['rgba(147, 51, 234, 0.2)'],
            borderColor: ['rgba(147, 51, 234, 1)'],
            borderWidth: 2
          }]
        };
      case 'quizzes':
        return {
          labels,
          datasets: [{
            label: 'Quizzes Completed',
            data: generateData(analyticsData.completedQuizzes / days, 0.6),
            backgroundColor: ['rgba(249, 115, 22, 0.2)'],
            borderColor: ['rgba(249, 115, 22, 1)'],
            borderWidth: 2
          }]
        };
      case 'performance':
        return {
          labels,
          datasets: [{
            label: 'Performance Score',
            data: generateData(analyticsData.performanceScore, 0.1),
            backgroundColor: ['rgba(239, 68, 68, 0.2)'],
            borderColor: ['rgba(239, 68, 68, 1)'],
            borderWidth: 2
          }]
        };
      default:
        return {
          labels,
          datasets: [{
            label: 'Activity',
            data: generateData(100, 0.3),
            backgroundColor: ['rgba(59, 130, 246, 0.2)'],
            borderColor: ['rgba(59, 130, 246, 1)'],
            borderWidth: 2
          }]
        };
    }
  };

  const chartData = generateChartData(selectedMetric);

  const getMetricIcon = (metric: string) => {
    const metricObj = metrics.find(m => m.id === metric);
    return metricObj ? metricObj.icon : BarChart3;
  };

  const getMetricColor = (metric: string) => {
    const metricObj = metrics.find(m => m.id === metric);
    return metricObj ? metricObj.color : 'blue';
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon: React.ComponentType<any>;
    color: string;
  }> = ({ title, value, change, changeType = 'neutral', icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-1 text-sm ${
              changeType === 'positive' ? 'text-green-600' :
              changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
            }`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${
                changeType === 'negative' ? 'rotate-180' : ''
              }`} />
              {change}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const SimpleChart: React.FC<{ data: ChartData }> = ({ data }) => {
    const maxValue = Math.max(...data.datasets[0].data);
    const minValue = Math.min(...data.datasets[0].data);
    const range = maxValue - minValue;

    return (
      <div className="h-64 flex items-end justify-between space-x-1">
        {data.datasets[0].data.map((value, index) => {
          const height = range > 0 ? ((value - minValue) / range) * 100 : 50;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className={`w-full rounded-t ${data.datasets[0].backgroundColor[0].replace('0.2', '0.8')} transition-all duration-300 hover:opacity-80`}
                style={{ height: `${height}%` }}
                title={`${data.labels[index]}: ${value}`}
              />
              <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                {data.labels[index]}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Advanced Analytics
              </h1>
              <p className="text-gray-600">
                Comprehensive insights and performance metrics for {school?.name || 'your school'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {showDetails ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
              <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Time Range:</span>
            <div className="flex space-x-1">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                    selectedTimeRange.value === range.value
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Metrics:</span>
            <div className="flex space-x-1">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <button
                    key={metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                    className={`flex items-center px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                      selectedMetric === metric.id
                        ? `bg-${metric.color}-100 text-${metric.color}-800`
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {metric.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        {selectedMetric === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={analyticsData.totalUsers.toLocaleString()}
              change="+12.5%"
              changeType="positive"
              icon={Users}
              color="green"
            />
            <StatCard
              title="Active Users"
              value={analyticsData.activeUsers.toLocaleString()}
              change="+8.2%"
              changeType="positive"
              icon={Target}
              color="blue"
            />
            <StatCard
              title="System Uptime"
              value={`${analyticsData.systemUptime}%`}
              change="+0.1%"
              changeType="positive"
              icon={CheckCircle}
              color="green"
            />
            <StatCard
              title="Performance Score"
              value={`${analyticsData.performanceScore}%`}
              change="+2.3%"
              changeType="positive"
              icon={TrendingUp}
              color="purple"
            />
          </div>
        )}

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {metrics.find(m => m.id === selectedMetric)?.label} Trends
              </h3>
              <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </button>
            </div>
            <SimpleChart data={chartData} />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Engagement Rate</span>
                <span className="text-sm font-semibold text-gray-900">{analyticsData.engagementRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Error Rate</span>
                <span className="text-sm font-semibold text-gray-900">{analyticsData.errorRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="text-sm font-semibold text-gray-900">{analyticsData.responseTime}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Content</span>
                <span className="text-sm font-semibold text-gray-900">{analyticsData.totalContent.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        {showDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <BookOpen className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Lesson Analytics</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Lessons</span>
                  <span className="font-semibold">{analyticsData.totalLessons.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">{analyticsData.completedLessons.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="font-semibold">
                    {Math.round((analyticsData.completedLessons / analyticsData.totalLessons) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <HelpCircle className="w-5 h-5 text-orange-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Quiz Analytics</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Quizzes</span>
                  <span className="font-semibold">{analyticsData.totalQuizzes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">{analyticsData.completedQuizzes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-semibold">
                    {Math.round((analyticsData.completedQuizzes / analyticsData.totalQuizzes) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Award className="w-5 h-5 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">System Uptime</span>
                  <span className="font-semibold text-green-600">{analyticsData.systemUptime}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Performance Score</span>
                  <span className="font-semibold text-blue-600">{analyticsData.performanceScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="font-semibold">{analyticsData.responseTime}ms</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Insights and Recommendations */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights & Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">High Engagement</p>
                  <p className="text-sm text-gray-600">Your engagement rate of {analyticsData.engagementRate}% is above average. Keep up the great work!</p>
                </div>
              </div>
              <div className="flex items-start">
                <TrendingUp className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Growing User Base</p>
                  <p className="text-sm text-gray-600">User growth is steady with {analyticsData.totalUsers} total users and {analyticsData.activeUsers} active users.</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Error Rate Monitoring</p>
                  <p className="text-sm text-gray-600">Your error rate of {analyticsData.errorRate}% is within acceptable limits. Continue monitoring.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-purple-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Response Time</p>
                  <p className="text-sm text-gray-600">Average response time of {analyticsData.responseTime}ms is good. Consider optimization for even better performance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;





