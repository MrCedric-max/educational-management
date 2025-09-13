import React from 'react';
import { Plus, Trash2, Edit, Copy, CheckCircle } from 'lucide-react';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  text: string;
  answers: any[];
  points: number;
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  subject: string;
  grade: string;
  description: string;
  timeLimit: number;
  questions: Question[];
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

interface QuestionsPanelProps {
  quiz: Quiz;
  setQuiz: React.Dispatch<React.SetStateAction<Quiz>>;
  onAddQuestion: (type: Question['type']) => void;
  onEditQuestion: (question: Question) => void;
  onDeleteQuestion: (questionId: string) => void;
  onDuplicateQuestion: (question: Question) => void;
}

const QuestionsPanel: React.FC<QuestionsPanelProps> = ({
  quiz,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onDuplicateQuestion
}) => {
  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True/False' },
    { value: 'short-answer', label: 'Short Answer' },
    { value: 'essay', label: 'Essay' }
  ];

  const getQuestionTypeIcon = (type: Question['type']) => {
    switch (type) {
      case 'multiple-choice':
        return '🔘';
      case 'true-false':
        return '✅';
      case 'short-answer':
        return '✏️';
      case 'essay':
        return '📝';
      default:
        return '❓';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
        <div className="flex space-x-2">
          {questionTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onAddQuestion(type.value as Question['type'])}
              className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm flex items-center space-x-1"
            >
              <Plus size={14} />
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {quiz.questions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
          <p className="text-gray-600 mb-4">Add your first question to get started</p>
          <button
            onClick={() => onAddQuestion('multiple-choice')}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add First Question
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getQuestionTypeIcon(question.type)}</span>
                    <span className="text-sm font-medium text-gray-600">
                      Question {index + 1} • {question.type.replace('-', ' ')} • {question.points} point{question.points !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-gray-900 mb-2">{question.text}</p>
                  
                  {question.type === 'multiple-choice' && (
                    <div className="space-y-1">
                      {question.answers.map((answer) => (
                        <div key={answer.id} className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${answer.isCorrect ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                          <span className={`text-sm ${answer.isCorrect ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                            {answer.text}
                          </span>
                          {answer.isCorrect && <CheckCircle size={14} className="text-green-500" />}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'true-false' && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Correct Answer:</span>
                      <span className={`text-sm font-medium ${question.answers.find(a => a.isCorrect)?.text === 'True' ? 'text-green-600' : 'text-red-600'}`}>
                        {question.answers.find(a => a.isCorrect)?.text}
                      </span>
                    </div>
                  )}
                  
                  {(question.type === 'short-answer' || question.type === 'essay') && (
                    <div className="text-sm text-gray-600 italic">
                      {question.type === 'short-answer' ? 'Short answer question' : 'Essay question'}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-1 ml-4">
                  <button
                    onClick={() => onEditQuestion(question)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-md"
                    title="Edit question"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDuplicateQuestion(question)}
                    className="p-2 text-gray-500 hover:bg-gray-50 rounded-md"
                    title="Duplicate question"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteQuestion(question.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                    title="Delete question"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionsPanel;
