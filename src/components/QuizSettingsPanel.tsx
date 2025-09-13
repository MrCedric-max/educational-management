import React from 'react';
import { Save, Eye } from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  subject: string;
  grade: string;
  description: string;
  timeLimit: number;
  questions: any[];
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

interface QuizSettingsPanelProps {
  quiz: Quiz;
  setQuiz: React.Dispatch<React.SetStateAction<Quiz>>;
  onSave: () => void;
  onPreview: () => void;
}

const QuizSettingsPanel: React.FC<QuizSettingsPanelProps> = ({
  quiz,
  setQuiz,
  onSave,
  onPreview
}) => {
  const handleInputChange = (field: keyof Quiz, value: string | number) => {
    setQuiz(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quiz Settings</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quiz Title *
        </label>
        <input
          type="text"
          value={quiz.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter quiz title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subject *
        </label>
        <select
          value={quiz.subject}
          onChange={(e) => handleInputChange('subject', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Select subject"
        >
          <option value="">Select Subject</option>
          <option value="Mathematics">Mathematics</option>
          <option value="English">English</option>
          <option value="Science">Science</option>
          <option value="Social Studies">Social Studies</option>
          <option value="Art">Art</option>
          <option value="Physical Education">Physical Education</option>
          <option value="Music">Music</option>
          <option value="Reading">Reading</option>
          <option value="Writing">Writing</option>
          <option value="Spelling">Spelling</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Class Level *
        </label>
        <select
          value={quiz.grade}
          onChange={(e) => handleInputChange('grade', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Select class level"
        >
          <option value="">Select Class</option>
          <option value="1">Class 1</option>
          <option value="2">Class 2</option>
          <option value="3">Class 3</option>
          <option value="4">Class 4</option>
          <option value="5">Class 5</option>
          <option value="6">Class 6</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Time Limit (minutes)
        </label>
        <input
          type="number"
          value={quiz.timeLimit}
          onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          min="1"
          max="180"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={quiz.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter quiz description"
          aria-label="Quiz description"
        />
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Total Questions:</span>
          <span className="text-sm text-gray-600">{quiz.questions.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total Points:</span>
          <span className="text-sm text-gray-600">{quiz.totalPoints}</span>
        </div>
      </div>

      <div className="flex space-x-2 pt-4">
        <button
          onClick={onPreview}
          className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center justify-center space-x-2"
        >
          <Eye size={16} />
          <span>Preview</span>
        </button>
        <button
          onClick={onSave}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center justify-center space-x-2"
        >
          <Save size={16} />
          <span>Save Quiz</span>
        </button>
      </div>
    </div>
  );
};

export default QuizSettingsPanel;
