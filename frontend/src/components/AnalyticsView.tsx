import React from 'react';
import { BarChart3, Users, TrendingUp, Play } from 'lucide-react';
import { Quiz, ClassAnalytics } from '../pages/QuizTool';

interface AnalyticsViewProps {
  savedQuizzes: Quiz[];
  currentQuiz: Quiz | null;
  setCurrentQuiz: (quiz: Quiz | null) => void;
  setCurrentView: (view: 'create' | 'preview' | 'analytics') => void;
  getClassAnalytics: (quizId: string) => ClassAnalytics;
  startQuiz: (quiz: Quiz) => void;
  previewQuiz: (quiz: Quiz) => void;
  userRole: 'teacher' | 'parent';
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  savedQuizzes,
  currentQuiz,
  setCurrentQuiz,
  setCurrentView,
  getClassAnalytics,
  startQuiz,
  previewQuiz,
  userRole
}) => {
  const analytics = currentQuiz ? getClassAnalytics(currentQuiz.id) : null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Class Performance Overview</h2>
        {analytics ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">{analytics.totalAttempts}</div>
                  <div className="text-sm text-blue-600">Total Attempts</div>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-green-600">{analytics.averageScore}%</div>
                  <div className="text-sm text-green-600">Average Score</div>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">{analytics.completionRate}%</div>
                  <div className="text-sm text-purple-600">Completion Rate</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Select a quiz to view analytics</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Available Quizzes</h2>
        <div className="space-y-4">
          {savedQuizzes.map((savedQuiz) => (
            <div key={savedQuiz.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{savedQuiz.title}</h3>
                  <p className="text-sm text-gray-600">{savedQuiz.description}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>{savedQuiz.subject}</span>
                    <span>Class {savedQuiz.class}</span>
                    <span>{savedQuiz.questions.length} questions</span>
                    <span>{savedQuiz.timeLimit} minutes</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {userRole === 'teacher' && (
                    <>
                      <button
                        onClick={() => {
                          setCurrentQuiz(savedQuiz);
                          setCurrentView('analytics');
                        }}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Analytics
                      </button>
                      <button
                        onClick={() => previewQuiz(savedQuiz)}
                        className="flex items-center px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Preview
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => startQuiz(savedQuiz)}
                    className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    {userRole === 'teacher' ? 'Test Quiz' : 'Take Quiz'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {analytics && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Question Analysis</h2>
          <div className="space-y-4">
            {analytics.questionAnalysis.map((question: any, index: number) => (
              <div key={question.questionId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Question {index + 1}: {question.questionText}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {question.difficulty}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <span>{question.correctAnswers} of {question.totalAttempts} students answered correctly</span>
                  <span className="ml-4">
                    ({Math.round((question.correctAnswers / question.totalAttempts) * 100)}% success rate)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsView;
