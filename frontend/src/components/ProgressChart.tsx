import React from 'react';

interface ProgressData {
  studentName: string;
  progress: number;
  completedObjectives: number;
  totalObjectives: number;
}

interface ProgressChartProps {
  data: ProgressData[];
  title: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data, title }) => {
  const maxProgress = Math.max(...data.map(d => d.progress));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-32 text-sm text-gray-600 truncate">
              {item.studentName}
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{Math.round(item.progress)}%</span>
                <span>{item.completedObjectives}/{item.totalObjectives}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    item.progress >= 80 ? 'bg-green-500' :
                    item.progress >= 60 ? 'bg-yellow-500' :
                    item.progress >= 40 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(item.progress / maxProgress) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressChart;
