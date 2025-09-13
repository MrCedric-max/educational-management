import React, { useState } from 'react';
import { Plus, Trash2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Question } from '../pages/QuizTool';

interface QuestionFormProps {
  question?: Question | null;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ question, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    text: question?.text || '',
    type: question?.type || 'multiple-choice' as 'multiple-choice' | 'true-false',
    points: question?.points || 5,
    answers: question?.answers || [
      { id: '1', text: '', isCorrect: false },
      { id: '2', text: '', isCorrect: false }
    ],
    explanation: question?.explanation || ''
  });

  const addAnswer = () => {
    setFormData(prev => ({
      ...prev,
      answers: [...prev.answers, { id: Date.now().toString(), text: '', isCorrect: false }]
    }));
  };

  const removeAnswer = (answerId: string) => {
    if (formData.answers.length > 2) {
      setFormData(prev => ({
        ...prev,
        answers: prev.answers.filter((a: any) => a.id !== answerId)
      }));
    }
  };

  const updateAnswer = (answerId: string, field: 'text' | 'isCorrect', value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      answers: prev.answers.map((a: any) => 
        a.id === answerId ? { ...a, [field]: value } : a
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.text.trim()) {
      toast.error('Please enter a question');
      return;
    }

    if (formData.answers.length < 2) {
      toast.error('Please add at least 2 answers');
      return;
    }

    const hasCorrectAnswer = formData.answers.some((a: any) => a.isCorrect);
    if (!hasCorrectAnswer) {
      toast.error('Please mark at least one answer as correct');
      return;
    }

    const newQuestion: Question = {
      id: question?.id || Date.now().toString(),
      text: formData.text,
      type: formData.type,
      points: formData.points,
      answers: formData.answers,
      explanation: formData.explanation
    };

    onSave(newQuestion);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
        <textarea
          value={formData.text}
          onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Enter your question"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              type: e.target.value as 'multiple-choice' | 'true-false',
              answers: e.target.value === 'true-false' ? [
                { id: '1', text: 'True', isCorrect: false },
                { id: '2', text: 'False', isCorrect: false }
              ] : prev.answers
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True/False</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
          <input
            type="number"
            value={formData.points}
            onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 1 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="100"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Answers</label>
        <div className="space-y-2">
          {formData.answers.map((answer: any, index: number) => (
            <div key={answer.id} className="flex items-center gap-2">
              <input
                type="radio"
                name="correctAnswer"
                checked={answer.isCorrect}
                onChange={() => {
                  setFormData(prev => ({
                    ...prev,
                    answers: prev.answers.map((a: any) => ({ ...a, isCorrect: a.id === answer.id }))
                  }));
                }}
                className="text-green-600"
              />
              <input
                type="text"
                value={answer.text}
                onChange={(e) => updateAnswer(answer.id, 'text', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Answer ${index + 1}`}
                required
              />
              {formData.answers.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeAnswer(answer.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        {formData.type === 'multiple-choice' && (
          <button
            type="button"
            onClick={addAnswer}
            className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Answer
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (Optional)</label>
        <textarea
          value={formData.explanation}
          onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
          placeholder="Explain why this answer is correct"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {question ? 'Update Question' : 'Add Question'}
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;
