import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, MessageSquare, Download, Bell, BookOpen, Target, CheckCircle, AlertTriangle, Clock, Wifi, WifiOff, LogOut, Globe, FileText, Send, Eye, Calendar, User, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

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

interface AttendanceRecord {
  date: Date;
  status: 'present' | 'absent' | 'late';
  reason?: string;
}

interface Message {
  id: string;
  from: 'teacher' | 'parent';
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: Date;
  type: 'general' | 'urgent' | 'event';
}

interface LearningTip {
  subject: string;
  tip: string;
  activity: string;
}

interface MonthlyReport {
  id: string;
  month: string;
  year: number;
  studentName: string;
  className: string;
  overallGrade: string;
  subjects: {
    subject: string;
    grade: string;
    comments: string;
  }[];
  teacherComments: string;
  attendance: number;
  behavior: string;
  generatedDate: Date;
}

const ParentPortal: React.FC = () => {
  const { user, logout, language, setLanguage } = useAuth();
  const [activeTab, setActiveTab] = useState<'progress' | 'messages' | 'announcements' | 'tips' | 'reports'>('progress');
  const [selectedStudent] = useState<Student | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Reset component state when user changes
  useEffect(() => {
    // Reset all state to initial values when user changes
    setActiveTab('progress');
    setIsOffline(false);
    setNewMessage('');
    setCurrentTime(new Date());
  }, [user?.id]); // Reset when user changes

  // Mock data - in a real app, this would come from an API
  const mockStudents: Student[] = [
    { id: '1', name: 'Emma Johnson', class: 'Class 1A' },
    { id: '2', name: 'Michael Brown', class: 'Class 1A' },
    { id: '3', name: 'Sophia Davis', class: 'Class 1A' },
  ];

  const mockQuizResults: QuizResult[] = [
    { id: '1', quizTitle: 'Math Basics - Addition', score: 18, maxScore: 20, date: new Date('2024-01-15'), subject: 'Mathematics' },
    { id: '2', quizTitle: 'English Vocabulary', score: 8, maxScore: 10, date: new Date('2024-01-16'), subject: 'English' },
    { id: '3', quizTitle: 'Math Basics - Subtraction', score: 16, maxScore: 20, date: new Date('2024-01-18'), subject: 'Mathematics' },
    { id: '4', quizTitle: 'Science - Animals', score: 7, maxScore: 10, date: new Date('2024-01-20'), subject: 'Science' },
  ];

  const mockAttendance: AttendanceRecord[] = [
    { date: new Date('2024-01-15'), status: 'present' },
    { date: new Date('2024-01-16'), status: 'present' },
    { date: new Date('2024-01-17'), status: 'absent', reason: 'Sick' },
    { date: new Date('2024-01-18'), status: 'late', reason: 'Traffic' },
    { date: new Date('2024-01-19'), status: 'present' },
  ];

  const mockMessages: Message[] = [
    { id: '1', from: 'teacher', content: language === 'fr' ? 'Emma a très bien réussi son quiz de mathématiques aujourd\'hui !' : 'Emma did great on her math quiz today!', timestamp: new Date('2024-01-20'), read: true },
    { id: '2', from: 'parent', content: language === 'fr' ? 'Merci pour la mise à jour. Elle s\'est entraînée à la maison.' : 'Thank you for the update. She\'s been practicing at home.', timestamp: new Date('2024-01-20'), read: true },
    { id: '3', from: 'teacher', content: language === 'fr' ? 'Conférence parent-enseignant programmée pour vendredi prochain à 15h.' : 'Parent-teacher conference scheduled for next Friday at 3 PM.', timestamp: new Date('2024-01-19'), read: false },
  ];

  const mockAnnouncements: Announcement[] = [
    {
      id: '1',
      title: language === 'fr' ? 'Semaine de Conférences Parent-Enseignant' : 'Parent-Teacher Conference Week',
      content: language === 'fr' ? 'Nous organiserons des conférences parent-enseignant du 15 au 19 mars. Veuillez planifier votre rendez-vous.' : 'We will be holding parent-teacher conferences from March 15-19. Please schedule your appointment.',
      date: new Date('2024-01-15'),
      type: 'event'
    },
    {
      id: '2',
      title: language === 'fr' ? 'Nouveau Programme de Mathématiques' : 'New Math Curriculum',
      content: language === 'fr' ? 'Nous introduisons un nouveau programme de mathématiques interactif qui aidera les élèves à apprendre par le jeu et les activités.' : 'We are introducing a new interactive math program that will help students learn through games and activities.',
      date: new Date('2024-01-10'),
      type: 'general'
    },
    {
      id: '3',
      title: language === 'fr' ? 'Fermeture de l\'École - Météo' : 'School Closure - Weather',
      content: language === 'fr' ? 'En raison des conditions météorologiques sévères, l\'école sera fermée demain. Restez en sécurité !' : 'Due to severe weather conditions, school will be closed tomorrow. Stay safe!',
      date: new Date('2024-01-08'),
      type: 'urgent'
    }
  ];

  const mockLearningTips: LearningTip[] = [
    {
      subject: language === 'fr' ? 'Mathématiques' : 'Mathematics',
      tip: language === 'fr' ? 'Votre enfant a des difficultés avec la multiplication. Essayez ce jeu simple pour pratiquer les tables de multiplication.' : 'Your child is struggling with multiplication. Try this simple game to practice the times tables.',
      activity: language === 'fr' ? 'Utilisez des objets du quotidien comme des boutons ou des pièces pour créer des problèmes de multiplication. Par exemple, "Si nous avons 3 groupes de 4 boutons, combien de boutons avons-nous au total ?"' : 'Use everyday objects like buttons or coins to create multiplication problems. For example, "If we have 3 groups of 4 buttons, how many buttons do we have in total?"'
    },
    {
      subject: language === 'fr' ? 'Anglais' : 'English',
      tip: language === 'fr' ? 'La compréhension de lecture peut être améliorée par une pratique quotidienne.' : 'Reading comprehension can be improved through daily practice.',
      activity: language === 'fr' ? 'Lisez une courte histoire ensemble et demandez à votre enfant de la raconter avec ses propres mots. Cela aide à la compréhension et à la mémoire.' : 'Read a short story together and ask your child to retell it in their own words. This helps with understanding and memory.'
    },
    {
      subject: language === 'fr' ? 'Sciences' : 'Science',
      tip: language === 'fr' ? 'Les concepts scientifiques sont plus faciles à comprendre quand ils sont liés à la vie réelle.' : 'Science concepts are easier to understand when connected to real life.',
      activity: language === 'fr' ? 'Allez faire une promenade dans la nature et identifiez différents types de plantes et d\'animaux. Discutez de leurs caractéristiques et habitats.' : 'Go for a nature walk and identify different types of plants and animals. Discuss their characteristics and habitats.'
    }
  ];

  const mockMonthlyReports: MonthlyReport[] = [
    {
      id: '1',
      month: language === 'fr' ? 'Janvier' : 'January',
      year: 2024,
      studentName: 'Emma Johnson',
      className: language === 'fr' ? 'Classe 1A' : 'Class 1A',
      overallGrade: 'B+',
      subjects: [
        { subject: language === 'fr' ? 'Mathématiques' : 'Mathematics', grade: 'A-', comments: language === 'fr' ? 'Excellent progrès en addition et soustraction' : 'Excellent progress in addition and subtraction' },
        { subject: language === 'fr' ? 'Anglais' : 'English', grade: 'B+', comments: language === 'fr' ? 'Bonne compréhension de lecture, a besoin de pratique en orthographe' : 'Good reading comprehension, needs practice with spelling' },
        { subject: language === 'fr' ? 'Sciences' : 'Science', grade: 'B', comments: language === 'fr' ? 'Montre de l\'intérêt pour la nature et les animaux' : 'Shows interest in nature and animals' }
      ],
      teacherComments: language === 'fr' ? 'Emma est une élève brillante qui montre un grand enthousiasme pour l\'apprentissage. Elle travaille bien avec les autres et est toujours prête à aider ses camarades de classe.' : 'Emma is a bright student who shows great enthusiasm for learning. She works well with others and is always willing to help her classmates.',
      attendance: 95,
      behavior: language === 'fr' ? 'Excellent' : 'Excellent',
      generatedDate: new Date('2024-01-31')
    },
    {
      id: '2',
      month: language === 'fr' ? 'Décembre' : 'December',
      year: 2023,
      studentName: 'Emma Johnson',
      className: language === 'fr' ? 'Classe 1A' : 'Class 1A',
      overallGrade: 'A-',
      subjects: [
        { subject: language === 'fr' ? 'Mathématiques' : 'Mathematics', grade: 'A', comments: language === 'fr' ? 'Forte compréhension des concepts mathématiques de base' : 'Strong understanding of basic math concepts' },
        { subject: language === 'fr' ? 'Anglais' : 'English', grade: 'A-', comments: language === 'fr' ? 'La fluidité en lecture s\'est considérablement améliorée' : 'Reading fluency has improved significantly' },
        { subject: language === 'fr' ? 'Sciences' : 'Science', grade: 'B+', comments: language === 'fr' ? 'Participation active aux expériences scientifiques' : 'Active participation in science experiments' }
      ],
      teacherComments: language === 'fr' ? 'Emma a eu un mois exceptionnel avec des performances constantes dans toutes les matières. Sa confiance a considérablement grandi.' : 'Emma had an outstanding month with consistent performance across all subjects. Her confidence has grown noticeably.',
      attendance: 100,
      behavior: language === 'fr' ? 'Excellent' : 'Excellent',
      generatedDate: new Date('2023-12-31')
    }
  ];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getStudentProgress = (studentId: string) => {
    const quizResults = mockQuizResults.filter(result => result.id === studentId || Math.random() > 0.5);
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

  const getAttendanceStatus = () => {
    const totalDays = mockAttendance.length;
    const presentDays = mockAttendance.filter(record => record.status === 'present').length;
    const absentDays = mockAttendance.filter(record => record.status === 'absent').length;
    const lateDays = mockAttendance.filter(record => record.status === 'late').length;
    
    return {
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      attendanceRate: (presentDays / totalDays) * 100
    };
  };

  const downloadProgressReport = () => {
    toast.success(language === 'en' ? 'Progress report downloaded successfully!' : 'Rapport de progression téléchargé avec succès!');
  };

  const downloadMonthlyReport = (report: MonthlyReport) => {
    toast.success(language === 'en' ? 'Monthly report downloaded successfully!' : 'Rapport mensuel téléchargé avec succès!');
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      toast.success(language === 'en' ? 'Message sent successfully!' : 'Message envoyé avec succès!');
      setNewMessage('');
    }
  };

  const toggleOfflineMode = () => {
    setIsOffline(!isOffline);
    toast.success(isOffline ? 
      (language === 'en' ? 'Back online!' : 'De retour en ligne!') : 
      (language === 'en' ? 'Offline mode enabled' : 'Mode hors ligne activé')
    );
  };

  const handleLanguageChange = () => {
    const newLanguage = language === 'en' ? 'fr' : 'en';
    setLanguage(newLanguage);
    toast.success(newLanguage === 'en' ? 'Language switched to English' : 'Langue changée en français');
  };

  const currentStudent = selectedStudent || mockStudents[0];
  const progress = getStudentProgress(currentStudent.id);
  const status = getTrafficLightStatus(progress.averageScore, progress.recentTrend);
  const attendance = getAttendanceStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold text-blue-600">
                  {currentStudent.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{currentStudent.name}</h1>
                <p className="text-sm text-gray-600">{currentStudent.class}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-xs text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-xs text-gray-500">
                  {currentTime.toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={handleLanguageChange}
                className="p-2 rounded-full hover:bg-gray-100"
                title={language === 'en' ? 'Switch to French' : 'Passer au français'}
              >
                <Globe className="h-5 w-5 text-blue-600" />
              </button>
              <button
                onClick={toggleOfflineMode}
                className="p-2 rounded-full hover:bg-gray-100"
                title={isOffline ? 'Go online' : 'Go offline'}
              >
                {isOffline ? <WifiOff className="h-5 w-5 text-gray-500" /> : <Wifi className="h-5 w-5 text-green-500" />}
              </button>
              {isOffline && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {language === 'en' ? 'Offline' : 'Hors ligne'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="border-t border-gray-200">
          <nav className="flex space-x-0">
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex-1 py-3 px-2 text-center text-xs font-medium border-b-2 ${
                activeTab === 'progress'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <Target className="h-4 w-4" />
                <span>{language === 'en' ? 'Progress' : 'Progrès'}</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex-1 py-3 px-2 text-center text-xs font-medium border-b-2 ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <FileText className="h-4 w-4" />
                <span>{language === 'en' ? 'Reports' : 'Rapports'}</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-3 px-2 text-center text-xs font-medium border-b-2 ${
                activeTab === 'messages'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex flex-col items-center space-y-1 relative">
                <MessageSquare className="h-4 w-4" />
                <span>{language === 'en' ? 'Messages' : 'Messages'}</span>
                {mockMessages.filter(m => !m.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {mockMessages.filter(m => !m.read).length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex-1 py-3 px-2 text-center text-xs font-medium border-b-2 ${
                activeTab === 'announcements'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <Bell className="h-4 w-4" />
                <span>{language === 'en' ? 'News' : 'Actualités'}</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`flex-1 py-3 px-2 text-center text-xs font-medium border-b-2 ${
                activeTab === 'tips'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <BookOpen className="h-4 w-4" />
                <span>{language === 'en' ? 'Tips' : 'Conseils'}</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 max-w-md mx-auto">
        {/* Real-time Progress Monitoring */}
        {activeTab === 'progress' && (
          <div className="space-y-4">
            {/* Progress Overview Card */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {language === 'en' ? 'Academic Progress' : 'Progrès Académique'}
                </h2>
                <div className="flex items-center space-x-2">
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
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {language === 'en' ? 'Average Score' : 'Score Moyen'}
                  </span>
                  <span className="text-2xl font-bold text-blue-600">{Math.round(progress.averageScore)}%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {language === 'en' ? 'Recent Trend' : 'Tendance Récente'}
                  </span>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(progress.recentTrend)}
                    <span className="text-sm text-gray-600">
                      {progress.recentTrend > 0 ? '+' : ''}{Math.round(progress.recentTrend)}%
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {language === 'en' ? 'Total Quizzes' : 'Total Quiz'}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{progress.totalQuizzes}</span>
                </div>
              </div>

              <button
                onClick={downloadProgressReport}
                className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Download Report' : 'Télécharger Rapport'}
              </button>
            </div>

            {/* Quiz Scores */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {language === 'en' ? 'Recent Quiz Scores' : 'Scores de Quiz Récents'}
              </h3>
              <div className="space-y-3">
                {progress.quizResults.slice(0, 3).map((result) => (
                  <div key={result.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{result.quizTitle}</p>
                      <p className="text-xs text-gray-500">{result.subject}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {Math.round((result.score / result.maxScore) * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">{result.score}/{result.maxScore}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance Tracking */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {language === 'en' ? 'Attendance' : 'Présence'}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {language === 'en' ? 'Attendance Rate' : 'Taux de Présence'}
                  </span>
                  <span className="text-lg font-bold text-blue-600">{Math.round(attendance.attendanceRate)}%</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-green-50 p-2 rounded">
                    <div className="text-lg font-bold text-green-600">{attendance.presentDays}</div>
                    <div className="text-xs text-green-600">
                      {language === 'en' ? 'Present' : 'Présent'}
                    </div>
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <div className="text-lg font-bold text-red-600">{attendance.absentDays}</div>
                    <div className="text-xs text-red-600">
                      {language === 'en' ? 'Absent' : 'Absent'}
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded">
                    <div className="text-lg font-bold text-yellow-600">{attendance.lateDays}</div>
                    <div className="text-xs text-yellow-600">
                      {language === 'en' ? 'Late' : 'En Retard'}
                    </div>
                  </div>
                </div>

                {attendance.absentDays > 0 && (
                  <div className="mt-3 p-2 bg-yellow-50 rounded">
                    <p className="text-xs text-yellow-800">
                      <AlertTriangle className="h-3 w-3 inline mr-1" />
                      {attendance.absentDays} {language === 'en' ? 'absence' : 'absence'}{attendance.absentDays > 1 ? (language === 'en' ? 's' : 's') : ''} {language === 'en' ? 'this month' : 'ce mois'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Monthly Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'en' ? 'Monthly Progress Reports' : 'Rapports de Progrès Mensuels'}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {language === 'en' 
                  ? 'Download detailed monthly reports generated by your child\'s teacher' 
                  : 'Téléchargez les rapports mensuels détaillés générés par l\'enseignant de votre enfant'
                }
              </p>
              
              <div className="space-y-3">
                {mockMonthlyReports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {report.month} {report.year}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {language === 'en' ? 'Overall Grade:' : 'Note Globale:'} 
                          <span className="font-medium ml-1">{report.overallGrade}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {language === 'en' ? 'Attendance:' : 'Présence:'} {report.attendance}%
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === 'en' ? 'Behavior:' : 'Comportement:'} {report.behavior}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        {language === 'en' ? 'Subject Grades:' : 'Notes par Matière:'}
                      </h4>
                      <div className="space-y-1">
                        {report.subjects.map((subject, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600">{subject.subject}</span>
                            <span className="font-medium">{subject.grade}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">
                        {language === 'en' ? 'Teacher Comments:' : 'Commentaires de l\'Enseignant:'}
                      </h4>
                      <p className="text-sm text-gray-600 italic">"{report.teacherComments}"</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {language === 'en' ? 'Generated:' : 'Généré:'} {report.generatedDate.toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => downloadMonthlyReport(report)}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                      >
                        <Download className="h-3 w-3" />
                        <span>{language === 'en' ? 'Download' : 'Télécharger'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Direct Communication Channel */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {/* Messages List */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {language === 'en' ? 'Messages' : 'Messages'}
              </h2>
              <div className="space-y-3">
                {mockMessages.map((message) => (
                  <div key={message.id} className={`p-3 rounded-lg ${
                    message.from === 'teacher' ? 'bg-blue-50' : 'bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium text-gray-600">
                        {message.from === 'teacher' ? 
                          (language === 'en' ? 'Teacher' : 'Enseignant') : 
                          (language === 'en' ? 'You' : 'Vous')
                        }
                      </span>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900">{message.content}</p>
                    {!message.read && message.from === 'teacher' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Simple Messaging Interface */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {language === 'en' ? 'Send Message' : 'Envoyer un Message'}
              </h3>
              <div className="space-y-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={language === 'en' ? 'Type your message here...' : 'Tapez votre message ici...'}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{language === 'en' ? 'Send Message' : 'Envoyer Message'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Announcements */}
        {activeTab === 'announcements' && (
          <div className="space-y-4">
            {mockAnnouncements.map((announcement) => (
              <div key={announcement.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    announcement.type === 'urgent' ? 'bg-red-100 text-red-800' :
                    announcement.type === 'event' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {announcement.type === 'urgent' ? 
                      (language === 'en' ? 'Urgent' : 'Urgent') :
                      announcement.type === 'event' ? 
                      (language === 'en' ? 'Event' : 'Événement') :
                      (language === 'en' ? 'General' : 'Général')
                    }
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                <span className="text-xs text-gray-500">{announcement.date.toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actionable Insights & Resources */}
        {activeTab === 'tips' && (
          <div className="space-y-4">
            {mockLearningTips.map((tip, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{tip.subject}</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      {language === 'en' ? 'Tip' : 'Conseil'}
                    </h4>
                    <p className="text-sm text-blue-800">{tip.tip}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="text-sm font-medium text-green-900 mb-1">
                      {language === 'en' ? 'Activity' : 'Activité'}
                    </h4>
                    <p className="text-sm text-green-800">{tip.activity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ParentPortal;