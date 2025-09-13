import React from 'react';
import { Plus, Trash2, Save, Edit, Copy, CheckCircle, BookOpen } from 'lucide-react';
import { Quiz, Question } from '../pages/QuizTool';

interface QuizCreationViewProps {
  quiz: Quiz;
  setQuiz: React.Dispatch<React.SetStateAction<Quiz>>;
  saveQuiz: (quiz: Quiz) => Promise<void>;
  addQuestion: (question: Question) => void;
  updateQuestion: (question: Question) => void;
  deleteQuestion: (questionId: string) => void;
  duplicateQuestion: (question: Question) => void;
  editQuestion: (question: Question) => void;
  setIsQuestionModalOpen: (open: boolean) => void;
  setEditingQuestion: (question: Question | null) => void;
  isQuestionModalOpen: boolean;
  editingQuestion: Question | null;
  isSaving?: boolean;
}

const QuizCreationView: React.FC<QuizCreationViewProps> = ({
  quiz,
  setQuiz,
  saveQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  duplicateQuestion,
  editQuestion,
  setIsQuestionModalOpen,
  setEditingQuestion,
  isQuestionModalOpen,
  editingQuestion,
  isSaving = false
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quiz Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
            <input
              type="text"
              value={quiz.title}
              onChange={(e) => setQuiz((prev: any) => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quiz title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              value={quiz.subject}
              onChange={(e) => setQuiz((prev: any) => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Select subject"
            >
              <option value="">Select Subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Science">Science</option>
              <option value="Social Studies">Social Studies</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              value={quiz.class}
              onChange={(e) => setQuiz((prev: any) => ({ ...prev, class: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Select class"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
            <input
              type="number"
              value={quiz.timeLimit}
              onChange={(e) => setQuiz((prev: any) => ({ ...prev, timeLimit: parseInt(e.target.value) || 30 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="120"
              title="Enter time limit in minutes"
              placeholder="Enter time limit"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={quiz.description}
            onChange={(e) => setQuiz((prev: any) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter quiz description"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => saveQuiz(quiz)}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Quiz'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Questions ({quiz.questions.length})</h2>
          <button
            onClick={() => setIsQuestionModalOpen(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </button>
        </div>
        
        {quiz.questions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No questions added yet. Click "Add Question" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {quiz.questions.map((question: any, index: number) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Question {index + 1}: {question.text}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editQuestion(question)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit question"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => duplicateQuestion(question)}
                      className="text-green-600 hover:text-green-800"
                      title="Duplicate question"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete question"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                    {question.type.replace('-', ' ')}
                  </span>
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded">
                    {question.points} points
                  </span>
                </div>
                <div className="mt-2">
                  {question.answers.map((answer: any) => (
                    <div key={answer.id} className="flex items-center text-sm">
                      <span className={`w-2 h-2 rounded-full mr-2 ${answer.isCorrect ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      {answer.text}
                      {answer.isCorrect && <CheckCircle className="h-4 w-4 ml-2 text-green-500" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCreationView;
