import React from 'react';
import { Clock, Award, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Quiz, StudentAnswer, QuizAttempt } from '../pages/QuizTool';

interface QuizTakingViewProps {
  currentQuiz: Quiz | null;
  studentAnswers: StudentAnswer[];
  currentQuestionIndex: number;
  timeRemaining: number;
  quizCompleted: boolean;
  quizResult: QuizAttempt | null;
  answerQuestion: (questionId: string, answerId: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  formatTime: (seconds: number) => string;
  userRole: 'teacher' | 'parent';
}

const QuizTakingView: React.FC<QuizTakingViewProps> = ({
  currentQuiz,
  studentAnswers,
  currentQuestionIndex,
  timeRemaining,
  quizCompleted,
  quizResult,
  answerQuestion,
  nextQuestion,
  previousQuestion,
  submitQuiz,
  resetQuiz,
  formatTime,
  userRole
}) => {
  if (!currentQuiz) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          {userRole === 'teacher' 
            ? 'No quiz selected. Please go to Preview or Analytics to select a quiz.'
            : 'No quiz selected. Please select a quiz to help your child practice.'
          }
        </p>
      </div>
    );
  }

  if (quizCompleted && quizResult) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="mb-6">
            <Award className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
            <p className="text-gray-600">Here are your results</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{quizResult.score}</div>
              <div className="text-sm text-blue-600">Points Earned</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{quizResult.percentage}%</div>
              <div className="text-sm text-green-600">Score</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{formatTime(quizResult.timeSpent)}</div>
              <div className="text-sm text-purple-600">Time Spent</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Feedback</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{quizResult.feedback}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Question Review</h3>
            {currentQuiz.questions.map((question: any, index: number) => {
              const studentAnswer = quizResult.answers.find((a: any) => a.questionId === question.id);
              const isCorrect = studentAnswer?.isCorrect || false;
              
              return (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">Question {index + 1}: {question.text}</h4>
                    <div className="flex items-center">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {question.explanation && (
                      <p className="mt-2 p-2 bg-blue-50 rounded">{question.explanation}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {userRole === 'teacher' ? 'Test Another Quiz' : 'Take Another Quiz'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const studentAnswer = studentAnswers.find((a: any) => a.questionId === currentQuestion.id);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{currentQuiz.title}</h2>
          <div className="flex items-center text-red-600">
            <Clock className="h-5 w-5 mr-2" />
            {formatTime(timeRemaining)}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</span>
            <span>{currentQuestion.points} points</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">{currentQuestion.text}</h3>
          <div className="space-y-3">
            {currentQuestion.answers.map((answer: any) => (
              <label
                key={answer.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  studentAnswer?.answerId === answer.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={answer.id}
                  checked={studentAnswer?.answerId === answer.id}
                  onChange={() => answerQuestion(currentQuestion.id, answer.id)}
                  className="mr-3"
                />
                {answer.text}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex gap-2">
            {currentQuestionIndex === currentQuiz.questions.length - 1 ? (
              <button
                onClick={submitQuiz}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTakingView;
