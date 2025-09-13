import React from 'react';
import { TrendingUp, TrendingDown, Target, Clock } from 'lucide-react';

interface AnalyticsData {
  totalStudents: number;
  averageProgress: number;
  completedObjectives: number;
  totalObjectives: number;
  onTrackStudents: number;
  atRiskStudents: number;
  recentActivity: number;
}

interface ProgressAnalyticsProps {
  data: AnalyticsData;
}

const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({ data }) => {
  const completionRate = data.totalObjectives > 0 ? (data.completedObjectives / data.totalObjectives) * 100 : 0;
  const onTrackPercentage = data.totalStudents > 0 ? (data.onTrackStudents / data.totalStudents) * 100 : 0;
  const atRiskPercentage = data.totalStudents > 0 ? (data.atRiskStudents / data.totalStudents) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Overall Progress */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Overall Progress</p>
            <p className="text-2xl font-bold text-gray-900">{Math.round(data.averageProgress)}%</p>
            <div className="flex items-center mt-2">
              {data.averageProgress >= 70 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${data.averageProgress >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                {data.averageProgress >= 70 ? 'On Track' : 'Needs Attention'}
              </span>
            </div>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Target className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Completion Rate</p>
            <p className="text-2xl font-bold text-gray-900">{Math.round(completionRate)}%</p>
            <p className="text-sm text-gray-500 mt-1">
              {data.completedObjectives} of {data.totalObjectives} objectives
            </p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Students On Track */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Students On Track</p>
            <p className="text-2xl font-bold text-gray-900">{data.onTrackStudents}</p>
            <p className="text-sm text-gray-500 mt-1">
              {Math.round(onTrackPercentage)}% of total students
            </p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <Target className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* At Risk Students */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">At Risk Students</p>
            <p className="text-2xl font-bold text-gray-900">{data.atRiskStudents}</p>
            <p className="text-sm text-gray-500 mt-1">
              {Math.round(atRiskPercentage)}% of total students
            </p>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <Clock className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressAnalytics;
