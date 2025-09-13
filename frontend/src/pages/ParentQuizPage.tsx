import React, { useState } from 'react';
import { Play, BookOpen, Clock, Users, Award, CheckCircle, XCircle, RotateCcw, TrendingUp, BarChart3, Eye, ArrowLeft, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Import interfaces from QuizTool
import { Quiz, StudentAnswer, QuizAttempt } from './QuizTool';

// Interface for learner progress tracking
interface Learner {
  id: string;
  name: string;
  classCode: string;
  className: string;
  parentName: string;
}

interface LearnerProgress {
  learnerId: string;
  learnerName: string;
  classCode: string;
  totalQuizzes: number;
  averageScore: number;
  lastQuizDate: Date;
  improvementTrend: 'up' | 'down' | 'stable';
  quizHistory: QuizAttempt[];
}

const ParentQuizPage: React.FC = () => {
  const { logout, user, language } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'quizzes' | 'progress'>('quizzes');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizAttempt | null>(null);
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);
  const [learnerInfo, setLearnerInfo] = useState({
    name: '',
    classCode: '',
    className: '',
    studentNumber: ''
  });

  // Available classes for selection
  const availableClasses = [
    { code: 'C1A', name: 'Class 1A', nameFr: 'Classe 1A' },
    { code: 'C1B', name: 'Class 1B', nameFr: 'Classe 1B' },
    { code: 'C2A', name: 'Class 2A', nameFr: 'Classe 2A' },
    { code: 'C2B', name: 'Class 2B', nameFr: 'Classe 2B' },
    { code: 'C3A', name: 'Class 3A', nameFr: 'Classe 3A' },
    { code: 'C3B', name: 'Class 3B', nameFr: 'Classe 3B' },
    { code: 'C4A', name: 'Class 4A', nameFr: 'Classe 4A' },
    { code: 'C4B', name: 'Class 4B', nameFr: 'Classe 4B' },
    { code: 'C5A', name: 'Class 5A', nameFr: 'Classe 5A' },
    { code: 'C5B', name: 'Class 5B', nameFr: 'Classe 5B' },
    { code: 'C6A', name: 'Class 6A', nameFr: 'Classe 6A' },
    { code: 'C6B', name: 'Class 6B', nameFr: 'Classe 6B' }
  ];

  // Student database - in a real app, this would come from a backend
  const studentDatabase = [
    // Class 1A
    { number: '001', name: 'Emma Johnson', class: 'Class 1A', classFr: 'Classe 1A', classCode: 'C1A' },
    { number: '002', name: 'Michael Brown', class: 'Class 1A', classFr: 'Classe 1A', classCode: 'C1A' },
    { number: '003', name: 'Sophia Davis', class: 'Class 1A', classFr: 'Classe 1A', classCode: 'C1A' },
    { number: '004', name: 'James Wilson', class: 'Class 1A', classFr: 'Classe 1A', classCode: 'C1A' },
    { number: '005', name: 'Olivia Miller', class: 'Class 1A', classFr: 'Classe 1A', classCode: 'C1A' },
    
    // Class 1B
    { number: '001', name: 'Liam Garcia', class: 'Class 1B', classFr: 'Classe 1B', classCode: 'C1B' },
    { number: '002', name: 'Ava Martinez', class: 'Class 1B', classFr: 'Classe 1B', classCode: 'C1B' },
    { number: '003', name: 'Noah Rodriguez', class: 'Class 1B', classFr: 'Classe 1B', classCode: 'C1B' },
    { number: '004', name: 'Isabella Lopez', class: 'Class 1B', classFr: 'Classe 1B', classCode: 'C1B' },
    { number: '005', name: 'William Gonzalez', class: 'Class 1B', classFr: 'Classe 1B', classCode: 'C1B' },
    
    // Class 2A
    { number: '001', name: 'Charlotte Perez', class: 'Class 2A', classFr: 'Classe 2A', classCode: 'C2A' },
    { number: '002', name: 'Benjamin Sanchez', class: 'Class 2A', classFr: 'Classe 2A', classCode: 'C2A' },
    { number: '003', name: 'Amelia Ramirez', class: 'Class 2A', classFr: 'Classe 2A', classCode: 'C2A' },
    { number: '004', name: 'Lucas Torres', class: 'Class 2A', classFr: 'Classe 2A', classCode: 'C2A' },
    { number: '005', name: 'Mia Flores', class: 'Class 2A', classFr: 'Classe 2A', classCode: 'C2A' },
    
    // Class 2B
    { number: '001', name: 'Henry Rivera', class: 'Class 2B', classFr: 'Classe 2B', classCode: 'C2B' },
    { number: '002', name: 'Evelyn Campbell', class: 'Class 2B', classFr: 'Classe 2B', classCode: 'C2B' },
    { number: '003', name: 'Alexander Mitchell', class: 'Class 2B', classFr: 'Classe 2B', classCode: 'C2B' },
    { number: '004', name: 'Abigail Carter', class: 'Class 2B', classFr: 'Classe 2B', classCode: 'C2B' },
    { number: '005', name: 'Mason Roberts', class: 'Class 2B', classFr: 'Classe 2B', classCode: 'C2B' },
    
    // Class 3A
    { number: '001', name: 'Harper Gomez', class: 'Class 3A', classFr: 'Classe 3A', classCode: 'C3A' },
    { number: '002', name: 'Ethan Phillips', class: 'Class 3A', classFr: 'Classe 3A', classCode: 'C3A' },
    { number: '003', name: 'Emily Evans', class: 'Class 3A', classFr: 'Classe 3A', classCode: 'C3A' },
    { number: '004', name: 'Logan Turner', class: 'Class 3A', classFr: 'Classe 3A', classCode: 'C3A' },
    { number: '005', name: 'Elizabeth Diaz', class: 'Class 3A', classFr: 'Classe 3A', classCode: 'C3A' },
    
    // Class 3B
    { number: '001', name: 'Sebastian Parker', class: 'Class 3B', classFr: 'Classe 3B', classCode: 'C3B' },
    { number: '002', name: 'Sofia Cruz', class: 'Class 3B', classFr: 'Classe 3B', classCode: 'C3B' },
    { number: '003', name: 'Jackson Edwards', class: 'Class 3B', classFr: 'Classe 3B', classCode: 'C3B' },
    { number: '004', name: 'Avery Collins', class: 'Class 3B', classFr: 'Classe 3B', classCode: 'C3B' },
    { number: '005', name: 'Ella Reyes', class: 'Class 3B', classFr: 'Classe 3B', classCode: 'C3B' },
    
    // Class 4A
    { number: '001', name: 'Carter Stewart', class: 'Class 4A', classFr: 'Classe 4A', classCode: 'C4A' },
    { number: '002', name: 'Madison Morris', class: 'Class 4A', classFr: 'Classe 4A', classCode: 'C4A' },
    { number: '003', name: 'Wyatt Morales', class: 'Class 4A', classFr: 'Classe 4A', classCode: 'C4A' },
    { number: '004', name: 'Scarlett Murphy', class: 'Class 4A', classFr: 'Classe 4A', classCode: 'C4A' },
    { number: '005', name: 'Luke Cook', class: 'Class 4A', classFr: 'Classe 4A', classCode: 'C4A' },
    
    // Class 4B
    { number: '001', name: 'Grace Rogers', class: 'Class 4B', classFr: 'Classe 4B', classCode: 'C4B' },
    { number: '002', name: 'Owen Reed', class: 'Class 4B', classFr: 'Classe 4B', classCode: 'C4B' },
    { number: '003', name: 'Chloe Cooper', class: 'Class 4B', classFr: 'Classe 4B', classCode: 'C4B' },
    { number: '004', name: 'Connor Bailey', class: 'Class 4B', classFr: 'Classe 4B', classCode: 'C4B' },
    { number: '005', name: 'Camila Rivera', class: 'Class 4B', classFr: 'Classe 4B', classCode: 'C4B' },
    
    // Class 5A
    { number: '001', name: 'Caleb Ward', class: 'Class 5A', classFr: 'Classe 5A', classCode: 'C5A' },
    { number: '002', name: 'Penelope Torres', class: 'Class 5A', classFr: 'Classe 5A', classCode: 'C5A' },
    { number: '003', name: 'Ryan Peterson', class: 'Class 5A', classFr: 'Classe 5A', classCode: 'C5A' },
    { number: '004', name: 'Layla Gray', class: 'Class 5A', classFr: 'Classe 5A', classCode: 'C5A' },
    { number: '005', name: 'Nathan Ramirez', class: 'Class 5A', classFr: 'Classe 5A', classCode: 'C5A' },
    
    // Class 5B
    { number: '001', name: 'Zoe James', class: 'Class 5B', classFr: 'Classe 5B', classCode: 'C5B' },
    { number: '002', name: 'Isaac Watson', class: 'Class 5B', classFr: 'Classe 5B', classCode: 'C5B' },
    { number: '003', name: 'Nora Brooks', class: 'Class 5B', classFr: 'Classe 5B', classCode: 'C5B' },
    { number: '004', name: 'Levi Kelly', class: 'Class 5B', classFr: 'Classe 5B', classCode: 'C5B' },
    { number: '005', name: 'Hazel Sanders', class: 'Class 5B', classFr: 'Classe 5B', classCode: 'C5B' },
    
    // Class 6A
    { number: '001', name: 'Gabriel Price', class: 'Class 6A', classFr: 'Classe 6A', classCode: 'C6A' },
    { number: '002', name: 'Violet Bennett', class: 'Class 6A', classFr: 'Classe 6A', classCode: 'C6A' },
    { number: '003', name: 'Julian Wood', class: 'Class 6A', classFr: 'Classe 6A', classCode: 'C6A' },
    { number: '004', name: 'Aurora Barnes', class: 'Class 6A', classFr: 'Classe 6A', classCode: 'C6A' },
    { number: '005', name: 'Aaron Ross', class: 'Class 6A', classFr: 'Classe 6A', classCode: 'C6A' },
    
    // Class 6B
    { number: '001', name: 'Savannah Henderson', class: 'Class 6B', classFr: 'Classe 6B', classCode: 'C6B' },
    { number: '002', name: 'Eli Coleman', class: 'Class 6B', classFr: 'Classe 6B', classCode: 'C6B' },
    { number: '003', name: 'Claire Jenkins', class: 'Class 6B', classFr: 'Classe 6B', classCode: 'C6B' },
    { number: '004', name: 'Landon Perry', class: 'Class 6B', classFr: 'Classe 6B', classCode: 'C6B' },
    { number: '005', name: 'Skylar Powell', class: 'Class 6B', classFr: 'Classe 6B', classCode: 'C6B' }
  ];
  const [showLearnerForm, setShowLearnerForm] = useState(true);

  // Mock data for learners
  const [learners] = useState<Learner[]>([
    {
      id: '1',
      name: 'Emma Johnson',
      classCode: 'C1A001',
      className: 'Class 1A',
      parentName: 'Sarah Johnson'
    },
    {
      id: '2',
      name: 'Michael Brown',
      classCode: 'C1A002',
      className: 'Class 1A',
      parentName: 'David Brown'
    },
    {
      id: '3',
      name: 'Sophia Davis',
      classCode: 'C2B001',
      className: 'Class 2B',
      parentName: 'Lisa Davis'
    },
    {
      id: '4',
      name: 'James Wilson',
      classCode: 'C1A003',
      className: 'Class 1A',
      parentName: 'Robert Wilson'
    }
  ]);

  // Mock data for learner progress
  const [learnerProgress] = useState<LearnerProgress[]>([
    {
      learnerId: '1',
      learnerName: 'Emma Johnson',
      classCode: 'C1A001',
      totalQuizzes: 8,
      averageScore: 85,
      lastQuizDate: new Date('2024-01-20'),
      improvementTrend: 'up',
      quizHistory: [
        {
          id: '1',
          studentId: '1',
          studentName: 'Emma Johnson',
          quizId: '1',
          answers: [],
          score: 90,
          totalPoints: 10,
          percentage: 90,
          timeSpent: 450,
          completedAt: new Date('2024-01-20'),
          feedback: 'Excellent work!'
        },
        {
          id: '2',
          studentId: '1',
          studentName: 'Emma Johnson',
          quizId: '2',
          answers: [],
          score: 8,
          totalPoints: 10,
          percentage: 80,
          timeSpent: 520,
          completedAt: new Date('2024-01-18'),
          feedback: 'Good job!'
        }
      ]
    },
    {
      learnerId: '2',
      learnerName: 'Michael Brown',
      classCode: 'C1A002',
      totalQuizzes: 6,
      averageScore: 78,
      lastQuizDate: new Date('2024-01-19'),
      improvementTrend: 'stable',
      quizHistory: [
        {
          id: '3',
          studentId: '2',
          studentName: 'Michael Brown',
          quizId: '1',
          answers: [],
          score: 7,
          totalPoints: 10,
          percentage: 70,
          timeSpent: 600,
          completedAt: new Date('2024-01-19'),
          feedback: 'Keep practicing!'
        }
      ]
    },
    {
      learnerId: '3',
      learnerName: 'Sophia Davis',
      classCode: 'C2B001',
      totalQuizzes: 10,
      averageScore: 92,
      lastQuizDate: new Date('2024-01-21'),
      improvementTrend: 'up',
      quizHistory: [
        {
          id: '4',
          studentId: '3',
          studentName: 'Sophia Davis',
          quizId: '2',
          answers: [],
          score: 9,
          totalPoints: 10,
          percentage: 90,
          timeSpent: 480,
          completedAt: new Date('2024-01-21'),
          feedback: 'Outstanding!'
        }
      ]
    },
    {
      learnerId: '4',
      learnerName: 'James Wilson',
      classCode: 'C1A003',
      totalQuizzes: 4,
      averageScore: 65,
      lastQuizDate: new Date('2024-01-17'),
      improvementTrend: 'down',
      quizHistory: [
        {
          id: '5',
          studentId: '4',
          studentName: 'James Wilson',
          quizId: '1',
          answers: [],
          score: 6,
          totalPoints: 10,
          percentage: 60,
          timeSpent: 700,
          completedAt: new Date('2024-01-17'),
          feedback: 'Review the basics and try again.'
        }
      ]
    }
  ]);

  // Mock data for available quizzes
  const [availableQuizzes] = useState<Quiz[]>([
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
    },
    {
      id: '2',
      title: 'English Vocabulary - Animals',
      description: 'Learn about different animals and their names',
      subject: 'English',
      class: '2',
      timeLimit: 20,
      questions: [
        {
          id: 'q3',
          text: 'Which animal says "meow"?',
          type: 'multiple-choice',
          points: 5,
          answers: [
            { id: 'a7', text: 'Dog', isCorrect: false },
            { id: 'a8', text: 'Cat', isCorrect: true },
            { id: 'a9', text: 'Cow', isCorrect: false },
            { id: 'a10', text: 'Bird', isCorrect: false }
          ],
          explanation: 'Cats say "meow" when they want attention or food.'
        }
      ],
      totalPoints: 5,
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16'),
      isPublished: true
    }
  ]);

  // Quiz Taking Functions
  const startQuiz = (selectedQuiz: Quiz) => {
    setCurrentQuiz(selectedQuiz);
    setStudentAnswers([]);
    setCurrentQuestionIndex(0);
    setTimeRemaining(selectedQuiz.timeLimit * 60);
    setQuizCompleted(false);
    setQuizResult(null);
    
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

  const submitQuiz = () => {
    if (!currentQuiz) return;

    const totalScore = studentAnswers.reduce((sum, answer) => sum + answer.pointsEarned, 0);
    const percentage = Math.round((totalScore / currentQuiz.totalPoints) * 100);
    const timeSpent = (currentQuiz.timeLimit * 60) - timeRemaining;

    const result: QuizAttempt = {
      id: Date.now().toString(),
      studentId: learnerInfo.classCode,
      studentName: learnerInfo.name,
      quizId: currentQuiz.id,
      answers: studentAnswers,
      score: totalScore,
      totalPoints: currentQuiz.totalPoints,
      percentage,
      timeSpent,
      completedAt: new Date(),
      feedback: generateFeedback(percentage)
    };

    setQuizResult(result);
    setQuizCompleted(true);
    toast.success('Quiz completed! Great job!');
  };

  const generateFeedback = (percentage: number): string => {
    if (percentage >= 90) return 'Outstanding! Your child has mastered this topic.';
    if (percentage >= 80) return 'Excellent work! Your child has a strong understanding.';
    if (percentage >= 70) return 'Good job! Your child understands most concepts.';
    if (percentage >= 60) return 'Not bad! Review the material together and try again.';
    return 'Keep practicing together! Review the basics and don\'t give up.';
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setStudentAnswers([]);
    setCurrentQuestionIndex(0);
    setTimeRemaining(0);
    setQuizCompleted(false);
    setQuizResult(null);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLearnerProgress = (learnerId: string): LearnerProgress | null => {
    return learnerProgress.find(progress => progress.learnerId === learnerId) || null;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleLearnerInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (learnerInfo.name.trim() && learnerInfo.className.trim() && learnerInfo.studentNumber.trim()) {
      setShowLearnerForm(false);
      toast.success(`Welcome, ${learnerInfo.name}!`);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleClassChange = (selectedClass: string) => {
    const classInfo = availableClasses.find(c => c.name === selectedClass);
    if (classInfo) {
      setLearnerInfo(prev => ({
        ...prev,
        className: language === 'fr' ? classInfo.nameFr : classInfo.name,
        classCode: classInfo.code,
        name: '', // Reset name when class changes
        studentNumber: '' // Reset student number when class changes
      }));
    }
  };

  const handleStudentNumberChange = (studentNumber: string) => {
    if (studentNumber && learnerInfo.classCode) {
      const student = studentDatabase.find(s => 
        s.number === studentNumber && s.classCode === learnerInfo.classCode
      );
      if (student) {
        setLearnerInfo(prev => ({
          ...prev,
          studentNumber: student.number,
          name: student.name,
          classCode: student.classCode
        }));
      }
    } else {
      setLearnerInfo(prev => ({
        ...prev,
        studentNumber: studentNumber,
        name: ''
      }));
    }
  };

  const getAvailableStudentNumbers = () => {
    if (!learnerInfo.classCode) return [];
    return studentDatabase
      .filter(s => s.classCode === learnerInfo.classCode)
      .map(s => s.number)
      .sort();
  };

  const resetLearnerInfo = () => {
    setLearnerInfo({ name: '', classCode: '', className: '', studentNumber: '' });
    setShowLearnerForm(true);
    setCurrentQuiz(null);
    setStudentAnswers([]);
    setCurrentQuestionIndex(0);
    setTimeRemaining(0);
    setQuizCompleted(false);
    setQuizResult(null);
  };

  // Show learner information form
  if (showLearnerForm) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'fr' ? 'Quiz de Pratique' : 'Practice Quizzes'}
          </h1>
          <p className="text-gray-600">
            {language === 'fr' ? 'Entrez vos informations pour commencer à pratiquer' : 'Enter your information to start practicing'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 text-center">
            {language === 'fr' ? 'Informations de l\'Apprenant' : 'Learner Information'}
          </h2>
          
          <form onSubmit={handleLearnerInfoSubmit} className="space-y-4">
            <div>
              <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Sélectionnez Votre Classe' : 'Select Your Class'}
              </label>
              <select
                id="className"
                value={learnerInfo.className}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">{language === 'fr' ? 'Choisissez votre classe...' : 'Choose your class...'}</option>
                {availableClasses.map((classOption) => (
                  <option key={classOption.code} value={classOption.name}>
                    {language === 'fr' ? classOption.nameFr : classOption.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Sélectionnez Votre Numéro d\'Étudiant' : 'Select Your Student Number'}
              </label>
              <select
                id="studentNumber"
                value={learnerInfo.studentNumber}
                onChange={(e) => handleStudentNumberChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!learnerInfo.classCode}
                required
              >
                <option value="">{language === 'fr' ? 'Choisissez votre numéro d\'étudiant...' : 'Choose your student number...'}</option>
                {getAvailableStudentNumbers().map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="learnerName" className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Votre Nom' : 'Your Name'}
              </label>
              <input
                type="text"
                id="learnerName"
                value={learnerInfo.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                placeholder={language === 'fr' ? 'Le nom apparaîtra ici lorsque vous sélectionnerez votre numéro d\'étudiant' : 'Name will appear here when you select your student number'}
                readOnly
              />
            </div>



            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
{language === 'fr' ? 'Continuer vers les Quiz de Pratique' : 'Continue to Practice Quizzes'}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">
              {language === 'fr' ? 'Classes Disponibles :' : 'Available Classes:'}
            </h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• {language === 'fr' ? 'Classe 1A, Classe 1B' : 'Class 1A, Class 1B'}</p>
              <p>• {language === 'fr' ? 'Classe 2A, Classe 2B' : 'Class 2A, Class 2B'}</p>
              <p>• {language === 'fr' ? 'Classe 3A, Classe 3B' : 'Class 3A, Class 3B'}</p>
              <p>• {language === 'fr' ? 'Classe 4A, Classe 4B' : 'Class 4A, Class 4B'}</p>
              <p>• {language === 'fr' ? 'Classe 5A, Classe 5B' : 'Class 5A, Class 5B'}</p>
              <p>• {language === 'fr' ? 'Classe 6A, Classe 6B' : 'Class 6A, Class 6B'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If a quiz is completed, show results
  if (quizCompleted && quizResult) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h1>
          <p className="text-gray-600">Here's how {learnerInfo.name} performed</p>
          <p className="text-sm text-gray-500">Class Code: {learnerInfo.classCode} | Class: {learnerInfo.className || 'Not specified'}</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="mb-6">
              <Award className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
              <p className="text-gray-600">Great job helping your child learn!</p>
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

            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold">Question Review</h3>
              {currentQuiz?.questions.map((question, index) => {
                const studentAnswer = quizResult.answers.find(a => a.questionId === question.id);
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

            <div className="flex gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Take Another Quiz
              </button>
              <button
                onClick={resetLearnerInfo}
                className="flex items-center px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                <Users className="h-4 w-4 mr-2" />
                Change Learner
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If a quiz is in progress, show the quiz interface
  if (currentQuiz) {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const studentAnswer = studentAnswers.find(a => a.questionId === currentQuestion.id);

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Quiz</h1>
          <p className="text-gray-600">Help {learnerInfo.name} practice and learn</p>
          <p className="text-sm text-gray-500">Class Code: {learnerInfo.classCode} | Class: {learnerInfo.className || 'Not specified'}</p>
        </div>

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
                {currentQuestion.answers.map((answer) => (
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
      </div>
    );
  }

  // Progress tracking view
  if (currentView === 'progress') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learner Progress Tracking</h1>
          <p className="text-gray-600">Monitor your child's learning progress over time</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setCurrentView('quizzes')}
                className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                <Play className="h-4 w-4 inline mr-2" />
{language === 'fr' ? 'Quiz de Pratique' : 'Practice Quizzes'}
              </button>
              <button
                onClick={() => setCurrentView('progress')}
                className="py-2 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600"
              >
                <BarChart3 className="h-4 w-4 inline mr-2" />
                Progress Tracking
              </button>
            </nav>
          </div>
        </div>

        {/* Learner Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Your Child</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learners.map((learner) => {
              const progress = getLearnerProgress(learner.id);
              return (
                <div
                  key={learner.id}
                  onClick={() => setSelectedLearner(learner)}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedLearner?.id === learner.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{learner.name}</h3>
                    <span className="text-sm text-gray-500">{learner.classCode}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{learner.className}</p>
                  {progress && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Avg Score: {progress.averageScore}%</span>
                      <div className="flex items-center">
                        {getTrendIcon(progress.improvementTrend)}
                        <span className={`ml-1 ${getTrendColor(progress.improvementTrend)}`}>
                          {progress.improvementTrend}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Learner Progress */}
        {selectedLearner && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedLearner.name}</h2>
                  <p className="text-gray-600">Class Code: {selectedLearner.classCode} | {selectedLearner.className}</p>
                </div>
                <button
                  onClick={() => setSelectedLearner(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              {(() => {
                const progress = getLearnerProgress(selectedLearner.id);
                if (!progress) {
                  return (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No progress data available for this learner.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-6">
                    {/* Progress Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{progress.totalQuizzes}</div>
                            <div className="text-sm text-blue-600">Total Quizzes</div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Award className="h-8 w-8 text-green-600 mr-3" />
                          <div>
                            <div className="text-2xl font-bold text-green-600">{progress.averageScore}%</div>
                            <div className="text-sm text-green-600">Average Score</div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Clock className="h-8 w-8 text-purple-600 mr-3" />
                          <div>
                            <div className="text-2xl font-bold text-purple-600">
                              {progress.lastQuizDate.toLocaleDateString()}
                            </div>
                            <div className="text-sm text-purple-600">Last Quiz</div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          {getTrendIcon(progress.improvementTrend)}
                          <div className="ml-3">
                            <div className={`text-2xl font-bold ${getTrendColor(progress.improvementTrend)}`}>
                              {progress.improvementTrend.toUpperCase()}
                            </div>
                            <div className="text-sm text-gray-600">Trend</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quiz History */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Recent Quiz History</h3>
                      <div className="space-y-3">
                        {progress.quizHistory.map((attempt) => (
                          <div key={attempt.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">Quiz #{attempt.quizId}</h4>
                                <p className="text-sm text-gray-600">
                                  Completed: {attempt.completedAt.toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Time: {formatTime(attempt.timeSpent)}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-green-600">{attempt.percentage}%</div>
                                <div className="text-sm text-gray-500">{attempt.score}/{attempt.totalPoints} points</div>
                              </div>
                            </div>
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                              <strong>Feedback:</strong> {attempt.feedback}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show available quizzes
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === 'fr' ? 'Quiz de Pratique' : 'Practice Quizzes'}
            </h1>
            <p className="text-gray-600">
              {language === 'fr' ? `Aidez ${learnerInfo.name} à pratiquer et apprendre avec ces quiz interactifs` : `Help ${learnerInfo.name} practice and learn with these interactive quizzes`}
            </p>
            <p className="text-sm text-gray-500">
              {language === 'fr' ? `Code de Classe : ${learnerInfo.classCode} | Classe : ${learnerInfo.className || 'Non spécifié'}` : `Class Code: ${learnerInfo.classCode} | Class: ${learnerInfo.className || 'Not specified'}`}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/parent-portal')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
            <button
              onClick={resetLearnerInfo}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Users className="h-4 w-4 mr-2" />
              Change Learner
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setCurrentView('quizzes')}
              className="py-2 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600"
            >
              <Play className="h-4 w-4 inline mr-2" />
              Practice Quizzes
            </button>
            <button
              onClick={() => setCurrentView('progress')}
              className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Progress Tracking
            </button>
          </nav>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Available Quizzes for Your Child</h2>
          <div className="space-y-4">
            {availableQuizzes.map((quiz) => (
              <div key={quiz.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{quiz.title}</h3>
                    <p className="text-sm text-gray-600">{quiz.description}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {quiz.subject}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Class {quiz.class}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {quiz.timeLimit} minutes
                      </span>
                      <span className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        {quiz.totalPoints} points
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startQuiz(quiz)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Quiz
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentQuizPage;
