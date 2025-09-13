import React from 'react';
import { Eye, Play, BookOpen, Clock, Users, Award } from 'lucide-react';
import { Quiz } from '../pages/QuizTool';

interface QuizPreviewViewProps {
  currentQuiz: Quiz | null;
  savedQuizzes: Quiz[];
  previewQuiz: (quiz: Quiz) => void;
  startQuiz: (quiz: Quiz) => void;
  userRole: 'teacher' | 'parent';
}

const QuizPreviewView: React.FC<QuizPreviewViewProps> = ({
  currentQuiz,
  savedQuizzes,
  previewQuiz,
  startQuiz,
  userRole
}) => {
  if (currentQuiz) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentQuiz.title}</h2>
              <p className="text-gray-600 mb-4">{currentQuiz.description}</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {currentQuiz.subject}
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Class {currentQuiz.class}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {currentQuiz.timeLimit} minutes
                </span>
                <span className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  {currentQuiz.totalPoints} points
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startQuiz(currentQuiz)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                {userRole === 'teacher' ? 'Test Quiz' : 'Start Quiz'}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Questions Preview ({currentQuiz.questions.length})</h3>
            <div className="space-y-4">
              {currentQuiz.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Question {index + 1}: {question.text}</h4>
                    <span className="text-sm text-gray-500">{question.points} points</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                      {question.type.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {question.answers.map((answer) => (
                      <div key={answer.id} className="flex items-center text-sm">
                        <span className={`w-2 h-2 rounded-full mr-2 ${answer.isCorrect ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        {answer.text}
                        {answer.isCorrect && <span className="ml-2 text-green-600 text-xs">(Correct)</span>}
                      </div>
                    ))}
                  </div>
                  {question.explanation && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          {userRole === 'teacher' ? 'Preview Available Quizzes' : 'Available Quizzes for Your Child'}
        </h2>
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
                    <span>{savedQuiz.totalPoints} points</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => previewQuiz(savedQuiz)}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </button>
                  <button
                    onClick={() => startQuiz(savedQuiz)}
                    className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    {userRole === 'teacher' ? 'Test' : 'Start'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPreviewView;














