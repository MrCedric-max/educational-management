import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Users, Target, Award, Filter, Download, Send, Eye, BarChart3, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { MobileCard, MobileButton, MobileGrid } from '../components/MobileOptimized';
import { useResponsive } from '../utils/responsiveUtils';

interface Student {
  id: string;
  name: string;
  class: string;
  avatar?: string;
}

interface QuizResult {
  id: string;
  quizTitle: string;
  score: number;
  maxScore: number;
  date: Date;
  subject: string;
}

interface QuestionAnalysis {
  questionId: string;
  questionText: string;
  correctAnswers: number;
  totalAttempts: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ClassInsights {
  averageScore: number;
  totalQuizzes: number;
  questionAnalysis: QuestionAnalysis[];
  commonDifficulties: string[];
}

const StudentProgress: React.FC = () => {
  const { language } = useAuth();
  const { isMobile } = useResponsive();
  const [selectedClass, setSelectedClass] = useState<string>('Class 1A');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  type ViewModeType = 'dashboard' | 'individual' | 'class-insights';
  const [viewMode, setViewMode] = useState<ViewModeType>('dashboard');
  

  // Mock data - in a real app, this would come from an API
  const mockStudents: Student[] = [
    { id: '1', name: 'Emma Johnson', class: 'Class 1A' },
    { id: '2', name: 'Michael Brown', class: 'Class 1A' },
    { id: '3', name: 'Sophia Davis', class: 'Class 1A' },
    { id: '4', name: 'James Wilson', class: 'Class 1A' },
    { id: '5', name: 'Olivia Miller', class: 'Class 1A' },
    { id: '6', name: 'Liam Garcia', class: 'Class 1B' },
    { id: '7', name: 'Ava Martinez', class: 'Class 1B' },
    { id: '8', name: 'Noah Rodriguez', class: 'Class 1B' },
  ];

  const mockQuizResults: QuizResult[] = [
    { id: '1', quizTitle: 'Math Basics - Addition', score: 18, maxScore: 20, date: new Date('2024-01-15'), subject: 'Mathematics' },
    { id: '2', quizTitle: 'English Vocabulary', score: 8, maxScore: 10, date: new Date('2024-01-16'), subject: 'English' },
    { id: '3', quizTitle: 'Math Basics - Subtraction', score: 16, maxScore: 20, date: new Date('2024-01-18'), subject: 'Mathematics' },
    { id: '4', quizTitle: 'Science - Animals', score: 7, maxScore: 10, date: new Date('2024-01-20'), subject: 'Science' },
    { id: '5', quizTitle: 'Math Basics - Multiplication', score: 19, maxScore: 20, date: new Date('2024-01-22'), subject: 'Mathematics' },
  ];

  const mockQuestionAnalysis: QuestionAnalysis[] = [
    { questionId: 'q1', questionText: 'What is 5 + 3?', correctAnswers: 18, totalAttempts: 20, difficulty: 'easy' },
    { questionId: 'q2', questionText: 'What is 12 - 7?', correctAnswers: 12, totalAttempts: 20, difficulty: 'medium' },
    { questionId: 'q3', questionText: 'What is 4 × 6?', correctAnswers: 8, totalAttempts: 20, difficulty: 'hard' },
    { questionId: 'q4', questionText: 'Which animal lives in water?', correctAnswers: 15, totalAttempts: 20, difficulty: 'easy' },
    { questionId: 'q5', questionText: 'What is the capital of France?', correctAnswers: 6, totalAttempts: 20, difficulty: 'hard' },
  ];

  const getStudentQuizResults = (studentId: string): QuizResult[] => {
    // Simulate different quiz results for different students
    const baseResults = mockQuizResults.slice(0, 3);
    return baseResults.map(result => ({
      ...result,
      score: Math.floor(Math.random() * (result.maxScore - result.maxScore * 0.6)) + result.maxScore * 0.6,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    }));
  };

  const getStudentProgress = (student: Student) => {
    const quizResults = getStudentQuizResults(student.id);
    const averageScore = quizResults.length > 0 
      ? quizResults.reduce((sum, result) => sum + (result.score / result.maxScore) * 100, 0) / quizResults.length
      : 0;
    
    const recentTrend = quizResults.length >= 2 
      ? (quizResults[quizResults.length - 1].score / quizResults[quizResults.length - 1].maxScore) * 100 -
        (quizResults[quizResults.length - 2].score / quizResults[quizResults.length - 2].maxScore) * 100
      : 0;

    return {
      averageScore,
      recentTrend,
      totalQuizzes: quizResults.length,
      quizResults
    };
  };

  const getTrafficLightStatus = (averageScore: number, trend: number) => {
    if (averageScore >= 80 && trend >= 0) return 'green';
    if (averageScore >= 60 && trend >= -5) return 'yellow';
    return 'red';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'green':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'yellow':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'red':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
  };

  const getClassInsights = (): ClassInsights => {
    const classStudents = mockStudents.filter(s => s.class === selectedClass);
    const allQuizResults = classStudents.flatMap(student => getStudentQuizResults(student.id));
    
    const averageScore = allQuizResults.length > 0
      ? allQuizResults.reduce((sum, result) => sum + (result.score / result.maxScore) * 100, 0) / allQuizResults.length
      : 0;

    const commonDifficulties = mockQuestionAnalysis
      .filter(q => (q.correctAnswers / q.totalAttempts) < 0.6)
      .map(q => q.questionText);

    return {
      averageScore,
      totalQuizzes: allQuizResults.length,
      questionAnalysis: mockQuestionAnalysis,
      commonDifficulties
    };
  };

  const sendParentReport = (student: Student) => {
    toast.success(`Progress report sent to ${student.name}'s parents!`);
  };

  const exportClassReport = () => {
    toast.success('Class progress report exported successfully!');
  };

  const filteredStudents = mockStudents.filter(student => student.class === selectedClass);
  const classInsights = getClassInsights();

  // Simple Visual Dashboard
  if (viewMode === 'dashboard') {
    return (
    <div className={`${isMobile ? 'p-4' : 'p-6'} max-w-7xl mx-auto`}>
      <div className="mb-6">
        <div className={`${isMobile ? 'flex-col space-y-4' : 'flex items-center justify-between'}`}>
          <div>
            <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 mb-2`}>
              {language === 'fr' ? 'Tableau de Bord des Progrès des Étudiants' : 'Student Progress Dashboard'}
            </h1>
            <p className="text-gray-600">
              {language === 'fr' ? 'Aperçu rapide des performances des étudiants avec système de feux de circulation' : 'Quick overview of student performance with traffic light system'}
            </p>
          </div>
        </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className={`-mb-px flex ${isMobile ? 'flex-col space-y-2' : 'space-x-8'}`}>
              <MobileButton
                onClick={() => setViewMode('dashboard')}
                variant={viewMode === 'dashboard' ? 'primary' : 'ghost'}
                className={`${isMobile ? 'w-full justify-start' : ''} ${
                  viewMode === 'dashboard' ? 'border-b-2 border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                touchOptimized
              >
                <BarChart3 className="h-4 w-4 inline mr-2" />
                {language === 'fr' ? 'Tableau de Bord' : 'Dashboard'}
              </MobileButton>
              <MobileButton
                onClick={() => setViewMode('individual' as const)}
                variant={(viewMode as string) === 'individual' ? 'primary' : 'ghost'}
                className={`${isMobile ? 'w-full justify-start' : ''} ${
                  (viewMode as string) === 'individual' ? 'border-b-2 border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                touchOptimized
              >
                <Eye className="h-4 w-4 inline mr-2" />
                {language === 'fr' ? 'Vue Individuelle' : 'Individual View'}
              </MobileButton>
              <MobileButton
                onClick={() => setViewMode('class-insights' as const)}
                variant={(viewMode as string) === 'class-insights' ? 'primary' : 'ghost'}
                className={`${isMobile ? 'w-full justify-start' : ''} ${
                  (viewMode as string) === 'class-insights' ? 'border-b-2 border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                touchOptimized
              >
                <Users className="h-4 w-4 inline mr-2" />
                {language === 'fr' ? 'Aperçus de Classe' : 'Class Insights'}
              </MobileButton>
            </nav>
          </div>
        </div>

        {/* Class Selection */}
        <MobileCard className="mb-6" padding="md">
          <div className={`${isMobile ? 'flex-col space-y-4' : 'flex items-center justify-between'}`}>
            <div className={`${isMobile ? 'flex-col space-y-2' : 'flex items-center space-x-4'}`}>
              <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {language === 'fr' ? 'Classe:' : 'Class:'}
                </span>
              </div>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation ${
                  isMobile ? 'w-full' : ''
                }`}
                title={language === 'fr' ? 'Sélectionner la classe pour voir les étudiants' : 'Select class to view students'}
              >
                <option value="Class 1A">Class 1A</option>
                <option value="Class 1B">Class 1B</option>
                <option value="Class 2A">Class 2A</option>
                <option value="Class 2B">Class 2B</option>
              </select>
            </div>
            <MobileButton
              onClick={exportClassReport}
              variant="primary"
              size="sm"
              className={isMobile ? 'w-full' : ''}
              touchOptimized
            >
              <Download className="h-4 w-4 mr-2" />
              {language === 'fr' ? 'Exporter le Rapport' : 'Export Report'}
            </MobileButton>
          </div>
        </MobileCard>

        {/* Traffic Light System Dashboard */}
        <MobileGrid 
          cols={{ mobile: 1, tablet: 2, desktop: 3 }} 
          gap="md"
          className="mb-6"
        >
          {filteredStudents.map((student) => {
            const progress = getStudentProgress(student);
            const status = getTrafficLightStatus(progress.averageScore, progress.recentTrend);
            
            return (
              <MobileCard key={student.id} padding="md" className="hover:shadow-md transition-shadow">
                <div className={`${isMobile ? 'flex-col space-y-4' : 'flex items-center justify-between mb-4'}`}>
                  <div className={`${isMobile ? 'flex-col space-y-3' : 'flex items-center space-x-3'}`}>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-blue-600">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.class}</p>
                    </div>
                  </div>
                  <div className={`${isMobile ? 'flex items-center justify-center space-x-2' : 'flex items-center space-x-2'}`}>
                    {getStatusIcon(status)}
                    <span className={`text-sm font-medium ${
                      status === 'green' ? 'text-green-600' :
                      status === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className={`${isMobile ? 'flex-col space-y-1' : 'flex justify-between items-center'}`}>
                    <span className="text-sm text-gray-600">
                      {language === 'fr' ? 'Score Moyen' : 'Average Score'}
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {Math.round(progress.averageScore)}%
                    </span>
                  </div>
                  
                  <div className={`${isMobile ? 'flex-col space-y-1' : 'flex justify-between items-center'}`}>
                    <span className="text-sm text-gray-600">
                      {language === 'fr' ? 'Tendance Récente' : 'Recent Trend'}
                    </span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(progress.recentTrend)}
                      <span className="text-sm text-gray-600">
                        {progress.recentTrend > 0 ? '+' : ''}{Math.round(progress.recentTrend)}%
                      </span>
                    </div>
                  </div>

                  <div className={`${isMobile ? 'flex-col space-y-1' : 'flex justify-between items-center'}`}>
                    <span className="text-sm text-gray-600">
                      {language === 'fr' ? 'Total Quiz' : 'Total Quizzes'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{progress.totalQuizzes}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <MobileButton
                    onClick={() => {
                      setSelectedStudent(student);
                      setViewMode('individual');
                    }}
                    variant="primary"
                    className="w-full"
                    touchOptimized
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {language === 'fr' ? 'Voir Détails' : 'View Details'}
                  </MobileButton>
                </div>
              </MobileCard>
            );
          })}
        </MobileGrid>

      </div>
    );
  }

  // Individual Student Progress View
  if (viewMode === 'individual') {
    // If no student is selected, show student selection interface
    if (!selectedStudent) {
      const classStudents = mockStudents.filter(student => student.class === selectedClass);
      
      return (
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Individual Student Progress</h1>
                <p className="text-gray-600">Select a student to view their detailed progress</p>
              </div>
              <div className="flex space-x-3">
              </div>
            </div>
          </div>

          {/* Student Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Select a Student from {selectedClass}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-blue-600">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.class}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      );
    }

    // If student is selected, show their detailed progress
    const progress = getStudentProgress(selectedStudent);
    
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedStudent.name}'s Progress</h1>
              <p className="text-gray-600">Detailed view of individual student performance</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Change Student
              </button>
            <button
              onClick={() => setViewMode('dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Dashboard
            </button>
            </div>
          </div>
        </div>

        {/* Student Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-semibold text-blue-600">
                  {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h2>
                <p className="text-gray-600">{selectedStudent.class}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{Math.round(progress.averageScore)}%</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
          </div>
        </div>

        {/* Quiz History */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Quiz History</h3>
          <div className="space-y-4">
            {progress.quizResults.map((result) => (
              <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{result.quizTitle}</h4>
                    <p className="text-sm text-gray-600">{result.subject}</p>
                    <p className="text-sm text-gray-500">{result.date.toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((result.score / result.maxScore) * 100)}%
                    </div>
                    <div className="text-sm text-gray-500">{result.score}/{result.maxScore}</div>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(result.score / result.maxScore) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Simple Progress Graph */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {progress.quizResults.map((result, index) => {
              const percentage = (result.score / result.maxScore) * 100;
              return (
                <div key={result.id} className="flex flex-col items-center space-y-2">
                  <div
                    className="bg-blue-500 rounded-t"
                    style={{ 
                      height: `${(percentage / 100) * 200}px`,
                      width: '40px'
                    }}
                  ></div>
                  <span className="text-xs text-gray-600">{Math.round(percentage)}%</span>
                  <span className="text-xs text-gray-500">Quiz {index + 1}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Parent Communication */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Parent Communication</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Send progress report to parents</p>
              <p className="text-sm text-gray-500">Includes quiz history and performance trends</p>
            </div>
            <button
              onClick={() => sendParentReport(selectedStudent)}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Report
            </button>
          </div>
        </div>

      </div>
    );
  }

  // Class-Wide Performance Insights
  if (viewMode === 'class-insights') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Class Performance Insights</h1>
              <p className="text-gray-600">Analyze common learning gaps and class-wide performance</p>
            </div>
            <div className="flex space-x-3">
            <button
              onClick={() => setViewMode('dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Dashboard
            </button>
            </div>
          </div>
        </div>

        {/* Class Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{Math.round(classInsights.averageScore)}%</div>
                <div className="text-sm text-blue-600">Class Average</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-green-600">{classInsights.totalQuizzes}</div>
                <div className="text-sm text-green-600">Total Quizzes</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{filteredStudents.length}</div>
                <div className="text-sm text-purple-600">Students</div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Analysis */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Question Analysis</h3>
          <div className="space-y-4">
            {classInsights.questionAnalysis.map((question) => {
              const successRate = (question.correctAnswers / question.totalAttempts) * 100;
              return (
                <div key={question.questionId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{question.questionText}</h4>
                    <span className={`px-2 py-1 rounded text-sm ${
                      question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {question.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <span>{question.correctAnswers} of {question.totalAttempts} students answered correctly</span>
                    <span className="font-medium">{Math.round(successRate)}% success rate</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        successRate >= 80 ? 'bg-green-500' :
                        successRate >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${successRate}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Common Difficulties */}
        {classInsights.commonDifficulties.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Areas Needing Attention</h3>
            <div className="space-y-2">
              {classInsights.commonDifficulties.map((difficulty, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-gray-700">{difficulty}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default StudentProgress;