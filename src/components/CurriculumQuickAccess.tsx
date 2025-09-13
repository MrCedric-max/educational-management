import React, { useState } from 'react';
import { BookOpen, Search, Target, Globe, Users, ChevronRight, Play, Eye } from 'lucide-react';
import { useCameroonianEducation } from '../contexts/CameroonianEducationContext';
import { useCameroonianCurriculum } from '../contexts/CameroonianCurriculumContext';
import { useAuth } from '../contexts/AuthContext';
import { SchoolSystem, PrimaryLevel, LearningTheme } from '../contexts/CameroonianEducationContext';
import QuizGenerator from './QuizGenerator';
import LessonViewer from './LessonViewer';

interface CurriculumQuickAccessProps {
  onNavigateToCurriculum?: () => void;
  onLessonSelect?: (lesson: any) => void;
  onQuizGenerate?: (topic: any) => void;
}

const CurriculumQuickAccess: React.FC<CurriculumQuickAccessProps> = ({
  onNavigateToCurriculum,
  onLessonSelect,
  onQuizGenerate
}) => {
  const { getClassDisplayName, getSubjects, getLearningThemes, getThemeLabel, getThemeSubjects } = useCameroonianEducation();
  const { language } = useAuth();
  const { getCompetenceBasedActivities } = useCameroonianCurriculum();

  const [selectedSystem, setSelectedSystem] = useState<SchoolSystem>('anglophone');
  const [selectedLevel, setSelectedLevel] = useState<PrimaryLevel>('1');
  const [selectedTheme, setSelectedTheme] = useState<LearningTheme | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [showLessonViewer, setShowLessonViewer] = useState(false);
  const [showQuizGenerator, setShowQuizGenerator] = useState(false);

  const levels: PrimaryLevel[] = ['1', '2', '3', '4', '5', '6', 'SIL'];
  const systems: { value: SchoolSystem; label: string }[] = [
    { value: 'anglophone', label: 'Anglophone' },
    { value: 'francophone', label: 'Francophone' }
  ];

  const subjects = getSubjects(selectedLevel, selectedSystem);
  const availableThemes = getLearningThemes(selectedLevel, selectedSystem);
  
  // Get all available subjects for the system
  const allSubjects = getSubjects(selectedLevel, selectedSystem);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Simple search through available subjects
      const subjects = getSubjects(selectedLevel, selectedSystem);
      const results = subjects.filter(subject => 
        subject.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results.slice(0, 3)); // Show only top 3 results
    } else {
      setSearchResults([]);
    }
  };

  const handleLessonSelect = (topic: any) => {
    setSelectedLesson(topic);
    setShowLessonViewer(true);
    if (onLessonSelect) {
      onLessonSelect(topic);
    }
  };

  const handleQuizGenerate = (topic: any) => {
    setSelectedTopic(topic);
    setShowQuizGenerator(true);
    if (onQuizGenerate) {
      onQuizGenerate(topic);
    }
  };

  const handleStartQuiz = (quiz: any) => {
    // Navigate to quiz tool with the generated quiz
    window.location.href = `/quiz?generated=${encodeURIComponent(JSON.stringify(quiz))}`;
  };

  const getCompetenceActivities = (subject: string) => {      
    return getCompetenceBasedActivities(subject, selectedLevel, selectedSystem);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            {language === 'en' ? 'Curriculum Quick Access' : 'Accès Rapide au Curriculum'}
          </h3>
        </div>
        {onNavigateToCurriculum && (
          <button
            onClick={onNavigateToCurriculum}
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
          >
            {language === 'en' ? 'View Full Curriculum' : 'Voir le Curriculum Complet'}
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        )}
      </div>

      {/* Quick Search */}
      <div className="mb-6">
        <div className="flex space-x-2 mb-3">
          <select
            value={selectedSystem}
            onChange={(e) => setSelectedSystem(e.target.value as SchoolSystem)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            aria-label="Select school system"
          >
            {systems.map(system => (
              <option key={system.value} value={system.value}>
                {system.label}
              </option>
            ))}
          </select>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as PrimaryLevel)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            aria-label="Select class level"
          >
            {levels.map(level => (
              <option key={level} value={level}>
                {getClassDisplayName(level, selectedSystem)}
              </option>
            ))}
          </select>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value as LearningTheme | '')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            aria-label="Select learning theme"
          >
            <option value="">{language === 'en' ? 'All Themes' : 'Tous les Thèmes'}</option>
            {availableThemes.map(theme => (
              <option key={theme} value={theme}>
                {getThemeLabel(theme, selectedSystem)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={language === 'en' ? 'Search curriculum topics...' : 'Rechercher des sujets de curriculum...'}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
          >
            {language === 'en' ? 'Search' : 'Rechercher'}
          </button>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            {language === 'en' ? 'Quick Search Results' : 'Résultats de Recherche Rapide'}
          </h4>
          <div className="space-y-2">
            {searchResults.map((topic, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 text-sm">{topic.title}</h5>
                  <p className="text-gray-600 text-xs">{topic.description}</p>
                </div>
                <div className="flex space-x-1 ml-3">
                  <button
                    onClick={() => handleLessonSelect(topic)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title={language === 'en' ? 'View Lesson' : 'Voir la Leçon'}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleQuizGenerate(topic)}
                    className="text-green-600 hover:text-green-800 p-1"
                    title={language === 'en' ? 'Generate Quiz' : 'Générer Quiz'}
                  >
                    <Play className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Subjects */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">
          {language === 'en' ? 'Available Subjects' : 'Matières Disponibles'}
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {subjects.slice(0, 6).map((subject, index) => (
            <div key={index} className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-blue-800 text-sm font-medium">{subject.name}</p>
              <p className="text-blue-600 text-xs">{subject.code}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-semibold text-gray-900 mb-3">
          {language === 'en' ? 'Quick Actions' : 'Actions Rapides'}
        </h4>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => {
              const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
              if (randomSubject) {
                const activities = getCompetenceActivities(randomSubject.name);
                if (activities.length > 0) {
                  const randomActivity = activities[Math.floor(Math.random() * activities.length)];
                  handleLessonSelect({ title: randomActivity, subject: randomSubject.name });
                }
              }
            }}
            className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <div className="flex items-center">
              <Target className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-green-800 text-sm font-medium">
                {language === 'en' ? 'Random Competence Activity' : 'Activité de Compétence Aléatoire'}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-green-600" />
          </button>
          
          <button
            onClick={() => {
              const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
              if (randomSubject) {
                handleQuizGenerate({ title: `${randomSubject.name} Quiz`, subject: randomSubject.name });
              }
            }}
            className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <div className="flex items-center">
              <Play className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-purple-800 text-sm font-medium">
                {language === 'en' ? 'Generate Random Quiz' : 'Générer Quiz Aléatoire'}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-purple-600" />
          </button>
        </div>
      </div>

      {/* System Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {language === 'en' ? 'Current System:' : 'Système Actuel:'}
          </span>
          <span className="font-medium text-gray-900">
            {selectedSystem === 'anglophone' ? 'Anglophone' : 'Francophone'} - {getClassDisplayName(selectedLevel, selectedSystem)}
          </span>
        </div>
      </div>

      {/* Modals */}
      {showLessonViewer && selectedLesson && (
        <LessonViewer
          lesson={selectedLesson}
          onClose={() => {
            setShowLessonViewer(false);
            setSelectedLesson(null);
          }}
          onGenerateQuiz={(lesson) => {
            setShowLessonViewer(false);
            setSelectedTopic(lesson);
            setShowQuizGenerator(true);
          }}
        />
      )}

      {showQuizGenerator && selectedTopic && (
        <QuizGenerator
          topic={selectedTopic}
          onClose={() => {
            setShowQuizGenerator(false);
            setSelectedTopic(null);
          }}
          onStartQuiz={handleStartQuiz}
        />
      )}
    </div>
  );
};

export default CurriculumQuickAccess;
