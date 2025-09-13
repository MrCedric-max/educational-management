import React, { useState } from 'react';
import { Plus, Trash2, XCircle } from 'lucide-react';

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  text: string;
  answers: Answer[];
  points: number;
  explanation?: string;
}

interface QuestionFormModalProps {
  isOpen: boolean;
  question: Question | null;
  onSave: (question: Question) => void;
  onClose: () => void;
}

const QuestionFormModal: React.FC<QuestionFormModalProps> = ({
  isOpen,
  question,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState<Question>(question || {
    id: '',
    type: 'multiple-choice',
    text: '',
    answers: [],
    points: 1,
    explanation: ''
  });

  const updateField = (field: keyof Question, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateAnswer = (answerId: string, field: keyof Answer, value: any) => {
    setFormData(prev => ({
      ...prev,
      answers: prev.answers.map(answer =>
        answer.id === answerId ? { ...answer, [field]: value } : answer
      )
    }));
  };

  const addAnswer = () => {
    const newAnswer: Answer = {
      id: Date.now().toString(),
      text: '',
      isCorrect: false
    };

    setFormData(prev => ({
      ...prev,
      answers: [...prev.answers, newAnswer]
    }));
  };

  const removeAnswer = (answerId: string) => {
    setFormData(prev => ({
      ...prev,
      answers: prev.answers.filter(answer => answer.id !== answerId)
    }));
  };

  const handleSave = () => {
    if (!formData.text.trim()) {
      alert('Please enter a question');
      return;
    }

    if (formData.type === 'multiple-choice' || formData.type === 'true-false') {
      const hasCorrectAnswer = formData.answers.some(answer => answer.isCorrect);
      if (!hasCorrectAnswer) {
        alert('Please select at least one correct answer');
        return;
      }
    }

    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {question?.id ? 'Edit Question' : 'Add New Question'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question *
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => updateField('text', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your question..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Points
            </label>
            <input
              type="number"
              value={formData.points}
              onChange={(e) => updateField('points', parseInt(e.target.value) || 1)}
              min="1"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {(formData.type === 'multiple-choice' || formData.type === 'true-false') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answers
              </label>
              <div className="space-y-2">
                {formData.answers.map((answer) => (
                  <div key={answer.id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correct-answer"
                      checked={answer.isCorrect}
                      onChange={() => {
                        // For multiple choice, only one answer can be correct
                        if (formData.type === 'multiple-choice') {
                          formData.answers.forEach(a => a.isCorrect = false);
                        }
                        updateAnswer(answer.id, 'isCorrect', true);
                      }}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      aria-label={`Mark as correct answer`}
                    />
                    <input
                      type="text"
                      value={answer.text}
                      onChange={(e) => updateAnswer(answer.id, 'text', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter answer option..."
                      aria-label="Answer option text"
                    />
                    {formData.type === 'multiple-choice' && formData.answers.length > 2 && (
                      <button
                        onClick={() => removeAnswer(answer.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Remove answer"
                        aria-label="Remove answer"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                {formData.type === 'multiple-choice' && (
                  <button
                    onClick={addAnswer}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center space-x-1"
                    title="Add new answer option"
                    aria-label="Add new answer option"
                  >
                    <Plus size={14} />
                    <span>Add Answer</span>
                  </button>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Explanation (Optional)
            </label>
            <textarea
              value={formData.explanation || ''}
              onChange={(e) => updateField('explanation', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Explain the correct answer..."
              aria-label="Question explanation"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Save Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionFormModal;
