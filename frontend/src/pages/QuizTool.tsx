import React, { useState } from 'react';
import { Plus, Eye, Edit, XCircle, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import QuizCreationView from '../components/QuizCreationView';
import QuizTakingView from '../components/QuizTakingView';
import QuizPreviewView from '../components/QuizPreviewView';
import AnalyticsView from '../components/AnalyticsView';
import QuestionForm from '../components/QuestionForm';
import { useCameroonianEducation } from '../contexts/CameroonianEducationContext';
import { quizService, Quiz as ApiQuiz } from '../services/quizService';

// Enhanced interfaces for comprehensive quiz system
export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false';
  points: number;
  answers: Answer[];
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  timeLimit: number;
  questions: Question[];
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
}

export interface StudentAnswer {
  questionId: string;
  answerId?: string;
  textAnswer?: string;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent?: number;
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  studentName: string;
  quizId: string;
  answers: StudentAnswer[];
  score: number;
  totalPoints: number;
  percentage: number;
  timeSpent: number;
  completedAt: Date;
  feedback: string;
}

export interface ClassAnalytics {
  totalAttempts: number;
  averageScore: number;
  completionRate: number;
  questionAnalysis: {
    questionId: string;
    questionText: string;
    correctAnswers: number;
    totalAttempts: number;
    difficulty: 'easy' | 'medium' | 'hard';
  }[];
}

const QuizTool: React.FC = () => {
  const { user } = useAuth();
  const { getSubjectsForSystem, getTerm } = useCameroonianEducation();
  const [currentView, setCurrentView] = useState<'create' | 'preview' | 'analytics'>('create');
  const [quiz, setQuiz] = useState<Quiz>({
    id: '',
    title: '',
    description: '',
    subject: '',
    class: '',
    timeLimit: 30,
    questions: [],
    totalPoints: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublished: false
  });

  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizAttempt | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // Load quizzes from backend
  const loadQuizzes = async () => {
    try {
      setIsLoading(true);
      const response = await quizService.getQuizzes();
      setQuizzes(response.quizzes.map(apiQuiz => convertApiQuizToFrontend(apiQuiz)));
    } catch (error) {
      console.error('Error loading quizzes:', error);
      toast.error('Failed to load quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  // Convert API quiz format to frontend format
  const convertApiQuizToFrontend = (apiQuiz: ApiQuiz): Quiz => {
    return {
      id: apiQuiz.id,
      title: apiQuiz.title,
      description: apiQuiz.instructions || '',
      subject: apiQuiz.subject,
      class: apiQuiz.className,
      timeLimit: apiQuiz.duration,
      questions: apiQuiz.questions.map((q: any) => ({
        id: q.id,
        text: q.question,
        type: q.type,
        points: q.points,
        answers: q.options?.map((option: string, index: number) => ({
          id: `option_${index}`,
          text: option,
          isCorrect: option === q.correctAnswer
        })) || [],
        explanation: ''
      })),
      totalPoints: apiQuiz.questions.reduce((sum: number, q: any) => sum + q.points, 0),
      createdAt: new Date(apiQuiz.createdAt),
      updatedAt: new Date(apiQuiz.updatedAt),
      isPublished: true
    };
  };

  // Convert frontend quiz format to API format
  const convertFrontendQuizToApi = (frontendQuiz: Quiz): Omit<ApiQuiz, 'id' | 'createdAt' | 'updatedAt'> => {
    return {
      title: frontendQuiz.title,
      subject: frontendQuiz.subject,
      className: frontendQuiz.class,
      duration: frontendQuiz.timeLimit,
      instructions: frontendQuiz.description,
      questions: frontendQuiz.questions.map(q => ({
        id: q.id,
        question: q.text,
        type: q.type,
        options: q.answers.map(a => a.text),
        correctAnswer: q.answers.find(a => a.isCorrect)?.text || '',
        points: q.points
      })),
      system: 'anglophone' // Default to anglophone for now
    };
  };

  // Save quiz to backend
  const saveQuiz = async (quizToSave: Quiz) => {
    try {
      setIsSaving(true);
      const apiData = convertFrontendQuizToApi(quizToSave);
      
      if (quizToSave.id) {
        // Update existing quiz
        await quizService.updateQuiz(quizToSave.id, apiData);
        toast.success('Quiz updated successfully!');
      } else {
        // Create new quiz
        const savedQuiz = await quizService.createQuiz(apiData);
        const frontendQuiz = convertApiQuizToFrontend(savedQuiz);
        setQuiz(frontendQuiz);
        toast.success('Quiz created successfully!');
      }
      
      // Reload quizzes list
      await loadQuizzes();
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error('Failed to save quiz');
    } finally {
      setIsSaving(false);
    }
  };

  // Load quizzes on component mount
  React.useEffect(() => {
    loadQuizzes();
  }, []);

  // Mock data for demonstration
  const savedQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'Math Basics - Addition',
      description: 'Basic addition problems for Class 1',
      subject: 'Mathematics',
      class: '1',
      timeLimit: 15,
      questions: [
        {
          id: 'q1',
          text: 'What is 2 + 3?',
          type: 'multiple-choice',
          points: 5,
          answers: [
            { id: 'a1', text: '4', isCorrect: false },
            { id: 'a2', text: '5', isCorrect: true },
            { id: 'a3', text: '6', isCorrect: false },
            { id: 'a4', text: '7', isCorrect: false }
          ],
          explanation: '2 + 3 = 5. You add 2 and 3 together.'
        },
        {
          id: 'q2',
          text: 'Is 4 + 1 = 5?',
          type: 'true-false',
          points: 5,
          answers: [
            { id: 'a5', text: 'True', isCorrect: true },
            { id: 'a6', text: 'False', isCorrect: false }
          ],
          explanation: 'Yes, 4 + 1 = 5 is correct.'
        }
      ],
      totalPoints: 10,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      isPublished: true
    }
  ];

  const [quizAttempts] = useState<QuizAttempt[]>([
    {
      id: 'attempt1',
      studentId: 'student1',
      studentName: 'Alice Johnson',
      quizId: '1',
      answers: [
        { questionId: 'q1', answerId: 'a2', isCorrect: true, pointsEarned: 5 },
        { questionId: 'q2', answerId: 'a5', isCorrect: true, pointsEarned: 5 }
      ],
      score: 10,
      totalPoints: 10,
      percentage: 100,
      timeSpent: 120,
      completedAt: new Date('2024-01-16'),
      feedback: 'Excellent work! You got all questions correct.'
    },
    {
      id: 'attempt2',
      studentId: 'student2',
      studentName: 'Bob Smith',
      quizId: '1',
      answers: [
        { questionId: 'q1', answerId: 'a1', isCorrect: false, pointsEarned: 0 },
        { questionId: 'q2', answerId: 'a5', isCorrect: true, pointsEarned: 5 }
      ],
      score: 5,
      totalPoints: 10,
      percentage: 50,
      timeSpent: 180,
      completedAt: new Date('2024-01-16'),
      feedback: 'Good effort! Review addition basics and try again.'
    }
  ]);

  // Quiz Creation Functions
  const addQuestion = (question: Question) => {
    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, question],
      totalPoints: prev.totalPoints + question.points,
      updatedAt: new Date()
    }));
    setIsQuestionModalOpen(false);
    setEditingQuestion(null);
    toast.success('Question added successfully!');
  };

  const updateQuestion = (updatedQuestion: Question) => {
    setQuiz(prev => {
      const oldQuestion = prev.questions.find(q => q.id === updatedQuestion.id);
      const newTotalPoints = prev.totalPoints - (oldQuestion?.points || 0) + updatedQuestion.points;
      
      return {
        ...prev,
        questions: prev.questions.map(q => 
          q.id === updatedQuestion.id ? updatedQuestion : q
        ),
        totalPoints: newTotalPoints,
        updatedAt: new Date()
      };
    });
    setIsQuestionModalOpen(false);
    setEditingQuestion(null);
    toast.success('Question updated successfully!');
  };

  const deleteQuestion = (questionId: string) => {
    setQuiz(prev => {
      const questionToDelete = prev.questions.find(q => q.id === questionId);
      return {
        ...prev,
        questions: prev.questions.filter(q => q.id !== questionId),
        totalPoints: prev.totalPoints - (questionToDelete?.points || 0),
        updatedAt: new Date()
      };
    });
    toast.success('Question deleted successfully!');
  };

  const duplicateQuestion = (question: Question) => {
    const duplicatedQuestion: Question = {
      ...question,
      id: Date.now().toString(),
      text: `${question.text} (Copy)`
    };
    addQuestion(duplicatedQuestion);
  };

  const editQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsQuestionModalOpen(true);
  };

  const saveQuizLocal = () => {
    if (!quiz.title || !quiz.subject || !quiz.class) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (quiz.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    const savedQuiz = {
      ...quiz,
      id: quiz.id || Date.now().toString(),
      createdAt: quiz.id ? quiz.createdAt : new Date(),
      updatedAt: new Date(),
      isPublished: true
    };

    setQuiz(savedQuiz);
    toast.success('Quiz saved and published successfully!');
  };

  // Quiz Taking Functions
  const startQuiz = (selectedQuiz: Quiz) => {
    setCurrentQuiz(selectedQuiz);
    setStudentAnswers([]);
    setCurrentQuestionIndex(0);
    setTimeRemaining(selectedQuiz.timeLimit * 60);
    setQuizCompleted(false);
    setQuizResult(null);
    setCurrentView('preview');
    
    // Start timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const answerQuestion = (questionId: string, answerId: string) => {
    const question = currentQuiz?.questions.find(q => q.id === questionId);
    const selectedAnswer = question?.answers.find(a => a.id === answerId);
    
    const newAnswer: StudentAnswer = {
      questionId,
      answerId,
      isCorrect: selectedAnswer?.isCorrect || false,
      pointsEarned: selectedAnswer?.isCorrect ? question?.points || 0 : 0
    };

    setStudentAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== questionId);
      return [...filtered, newAnswer];
    });
  };

  const nextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    if (!currentQuiz) return;

    try {
      setIsLoading(true);
      
      // Convert student answers to API format
      const apiAnswers = studentAnswers.map(answer => ({
        questionId: answer.questionId,
        answer: answer.textAnswer || answer.answerId || '',
        timeSpent: answer.timeSpent || 0
      }));

      // Submit to backend
      const result = await quizService.submitQuiz(currentQuiz.id, { answers: apiAnswers });
      
      // Update local state with result
      setQuizResult({
        id: result.result.id,
        quizId: result.result.quizId,
        studentId: result.result.userId,
        studentName: user?.fullName || 'Student',
        answers: result.result.answers.map((a: any) => ({
          questionId: a.questionId,
          answerId: a.answerId,
          textAnswer: a.textAnswer,
          isCorrect: a.isCorrect,
          pointsEarned: a.pointsEarned,
          timeSpent: a.timeSpent
        })),
        score: result.result.score,
        totalPoints: currentQuiz.totalPoints,
        percentage: Math.round((result.result.score / currentQuiz.totalPoints) * 100),
        timeSpent: result.result.answers.reduce((sum: number, a: any) => sum + (a.timeSpent || 0), 0),
        completedAt: new Date(result.result.completedAt),
        feedback: generateFeedback(Math.round((result.result.score / currentQuiz.totalPoints) * 100))
      });

      setQuizCompleted(true);
      setCurrentView('analytics');
      toast.success(`Quiz completed! Score: ${result.percentage}%`);
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const generateFeedback = (percentage: number): string => {
    if (percentage >= 90) return 'Outstanding! You have mastered this topic.';
    if (percentage >= 80) return 'Excellent work! You have a strong understanding.';
    if (percentage >= 70) return 'Good job! You understand most concepts.';
    if (percentage >= 60) return 'Not bad! Review the material and try again.';
    return 'Keep practicing! Review the basics and don\'t give up.';
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setStudentAnswers([]);
    setCurrentQuestionIndex(0);
    setTimeRemaining(0);
    setQuizCompleted(false);
    setQuizResult(null);
    setCurrentView('create');
  };

  const previewQuiz = (selectedQuiz: Quiz) => {
    setCurrentQuiz(selectedQuiz);
    setCurrentView('preview');
  };

  // Analytics Functions
  const getClassAnalytics = (quizId: string): ClassAnalytics => {
    const attempts = quizAttempts.filter(attempt => attempt.quizId === quizId);
    const totalAttempts = attempts.length;
    const averageScore = attempts.length > 0 ? 
      attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempts.length : 0;
    const completionRate = 100; // Mock data

    const questionAnalysis = currentQuiz?.questions.map(question => {
      const questionAttempts = attempts.filter(attempt => 
        attempt.answers.some(answer => answer.questionId === question.id)
      );
      const correctAnswers = attempts.filter(attempt => 
        attempt.answers.some(answer => 
          answer.questionId === question.id && answer.isCorrect
        )
      ).length;
      
      const difficulty: 'easy' | 'medium' | 'hard' = correctAnswers / questionAttempts.length >= 0.8 ? 'easy' :
                        correctAnswers / questionAttempts.length >= 0.6 ? 'medium' : 'hard';

      return {
        questionId: question.id,
        questionText: question.text,
        correctAnswers,
        totalAttempts: questionAttempts.length,
        difficulty
      };
    }) || [];

    return {
      totalAttempts,
      averageScore: Math.round(averageScore),
      completionRate,
      questionAnalysis
    };
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get subjects based on school system
  const availableSubjects = user?.schoolId ? 
    getSubjectsForSystem('anglophone') : // This should be determined from school data
    ['Mathematics', 'English', 'Science', 'Social Studies', 'French'];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Tool</h1>
            <p className="text-gray-600">Create, preview, and analyze quizzes with automated grading</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setCurrentView('create')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                currentView === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Plus className="h-4 w-4 inline mr-2" />
              Create Quiz
            </button>
            <button
              onClick={() => setCurrentView('preview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                currentView === 'preview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Eye className="h-4 w-4 inline mr-2" />
              Preview Quiz
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                currentView === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Analytics
            </button>
          </nav>
        </div>
      </div>

      {/* Content based on current view */}
      {currentView === 'create' && <QuizCreationView 
        quiz={quiz}
        setQuiz={setQuiz}
        saveQuiz={saveQuiz}
        addQuestion={addQuestion}
        updateQuestion={updateQuestion}
        deleteQuestion={deleteQuestion}
        duplicateQuestion={duplicateQuestion}
        editQuestion={editQuestion}
        setIsQuestionModalOpen={setIsQuestionModalOpen}
        setEditingQuestion={setEditingQuestion}
        isQuestionModalOpen={isQuestionModalOpen}
        editingQuestion={editingQuestion}
        isSaving={isSaving}
      />}
      {currentView === 'preview' && <QuizPreviewView 
        currentQuiz={currentQuiz}
        savedQuizzes={quizzes}
        previewQuiz={previewQuiz}
        startQuiz={startQuiz}
        userRole="teacher"
      />}
      {currentView === 'analytics' && <AnalyticsView 
        savedQuizzes={quizzes}
        currentQuiz={currentQuiz}
        setCurrentQuiz={setCurrentQuiz}
        setCurrentView={setCurrentView}
        getClassAnalytics={getClassAnalytics}
        startQuiz={startQuiz}
        previewQuiz={previewQuiz}
        userRole="teacher"
      />}

      {/* Question Form Modal */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h2>
              <button
                onClick={() => {
                  setIsQuestionModalOpen(false);
                  setEditingQuestion(null);
                }}
                className="text-gray-400 hover:text-gray-600"
                title="Close modal"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <QuestionForm
              question={editingQuestion}
              onSave={editingQuestion ? updateQuestion : addQuestion}
              onCancel={() => {
                setIsQuestionModalOpen(false);
                setEditingQuestion(null);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default QuizTool;
