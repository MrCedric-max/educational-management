import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Filter, ChevronDown, ChevronRight, 
  Target, Users, Globe, Clock, Award, Download, Eye,
  Play, Pause, RotateCcw, Star, Crown, Zap, FileText
} from 'lucide-react';
import { useCameroonianEducation } from '../contexts/CameroonianEducationContext';
import { useCameroonianCurriculum } from '../contexts/CameroonianCurriculumContext';
import { useAuth } from '../contexts/AuthContext';
import { SchoolSystem, PrimaryLevel, LearningTheme } from '../contexts/CameroonianEducationContext';
import QuizGenerator from './QuizGenerator';
import LessonViewer from './LessonViewer';
// import CameroonianCurriculumTest from './CameroonianCurriculumTest';
import CurriculumQuickAccess from './CurriculumQuickAccess';
import AutoLessonPlanGenerator from './AutoLessonPlanGenerator';
import AutoQuizGenerator from './AutoQuizGenerator';

interface CurriculumBrowserProps {
  onLessonSelect?: (lesson: any) => void;
  onQuizGenerate?: (topic: any) => void;
}

const CurriculumBrowser: React.FC<CurriculumBrowserProps> = ({ 
  onLessonSelect, 
  onQuizGenerate 
}) => {
  const { getClassDisplayName, getSubjects, getSystemDescription, getLearningThemes, getThemeLabel, getThemeDescription, getThemeSubjects } = useCameroonianEducation();
  const { language, setLanguage } = useAuth();
  const {
    getCompetenceBasedActivities,
    getProjectPedagogySuggestions,
    getAfricanContextExamples
  } = useCameroonianCurriculum();

  const [selectedSystem, setSelectedSystem] = useState<SchoolSystem>('anglophone');
  const [selectedLevel, setSelectedLevel] = useState<PrimaryLevel>('1');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<LearningTheme | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [showLessonViewer, setShowLessonViewer] = useState(false);
  const [showQuizGenerator, setShowQuizGenerator] = useState(false);
  const [showAutoLessonPlanGenerator, setShowAutoLessonPlanGenerator] = useState(false);
  const [showAutoQuizGenerator, setShowAutoQuizGenerator] = useState(false);

  const levels: PrimaryLevel[] = ['1', '2', '3', '4', '5', '6', 'SIL'];
  const systems: { value: SchoolSystem; label: string }[] = [
    { value: 'anglophone', label: 'Anglophone' },
    { value: 'francophone', label: 'Francophone' }
  ];

  const subjects = getSubjects(selectedLevel, selectedSystem);
  const availableThemes = getLearningThemes(selectedLevel, selectedSystem);
  const searchResults = searchQuery ? subjects.filter(subject => 
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];
  
  // Get all available subjects for the system (not just those in curriculum data)
  const allSubjects = getSubjects(selectedLevel, selectedSystem);
  
  // Filter topics by selected theme (based on curriculum subjects)
  const filterTopicsByTheme = (topics: any[], subjectName: string) => {
    if (!selectedTheme) return topics;
    
    // Get the subjects that belong to this theme
    const themeSubjects = getThemeSubjects(selectedTheme, selectedSystem);
    
    // Check if the current subject matches any of the theme subjects
    const subjectMatches = themeSubjects.some(themeSubject => 
      subjectName.toLowerCase().includes(themeSubject.toLowerCase()) ||
      themeSubject.toLowerCase().includes(subjectName.toLowerCase())
    );
    
    if (subjectMatches) {
      return topics;
    }
    
    // If subject doesn't match, filter topics by keywords as fallback
    return topics.filter(topic => {
      const topicText = `${topic.title} ${topic.description}`.toLowerCase();
      const themeKeywords = {
        english_language: ['english', 'language', 'literature', 'listening', 'speaking', 'reading', 'writing', 'grammar', 'vocabulary', 'punctuation', 'phonics', 'comprehension', 'expression', 'oral', 'written'],
        mathematics: ['mathematics', 'math', 'sets', 'logic', 'numbers', 'operations', 'measurements', 'size', 'geometry', 'space', 'statistics', 'graphs', 'counting', 'addition', 'subtraction', 'multiplication', 'division'],
        science_technology: ['science', 'technology', 'health', 'education', 'environmental', 'engineering', 'scientific', 'experiment', 'observation', 'investigation', 'discovery', 'natural', 'living', 'non-living'],
        francais: ['français', 'french', 'compréhension', 'expression', 'orale', 'écrite', 'lecture', 'vocabulaire', 'grammaire', 'conjugaison', 'orthographe', 'comprehension', 'oral', 'written'],
        social_studies: ['social', 'studies', 'history', 'geography', 'citizenship', 'civics', 'moral', 'education', 'human', 'rights', 'peace', 'security', 'community', 'society', 'culture', 'tradition'],
        vocational_studies: ['vocational', 'studies', 'home', 'economics', 'arts', 'crafts', 'agro', 'pastoral', 'farming', 'practical', 'skills', 'domestic', 'agriculture', 'livestock'],
        arts: ['arts', 'visual', 'performing', 'creative', 'drawing', 'painting', 'sculpture', 'design', 'color', 'shape', 'form', 'aesthetic', 'beauty', 'imagination', 'expression', 'drama', 'music', 'dance'],
        physical_education: ['physical', 'education', 'sports', 'exercise', 'fitness', 'health', 'body', 'movement', 'game', 'play', 'activity', 'strength', 'endurance', 'coordination', 'balance'],
        national_languages: ['national', 'languages', 'cultures', 'indigenous', 'native', 'traditional', 'mother', 'tongue', 'dialect', 'vernacular', 'cultural', 'heritage', 'community', 'tribal', 'ethnic'],
        ict: ['ict', 'information', 'communication', 'technologies', 'computer', 'system', 'tools', 'internet', 'computational', 'thinking', 'digital', 'technology', 'software', 'hardware', 'programming']
      };
      
      const keywords = themeKeywords[selectedTheme] || [];
      return keywords.some(keyword => topicText.includes(keyword));
    });
  };

  const toggleTopicExpansion = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
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

  const getProjectSuggestions = (subject: string) => {       
    return getProjectPedagogySuggestions(subject, selectedLevel, selectedSystem);
  };

  const getAfricanExamples = (subject: string) => {
    return getAfricanContextExamples(subject, selectedLevel, selectedSystem);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'en' ? 'Cameroonian Curriculum Browser' : 'Navigateur de Curriculum Camerounais'}
              </h1>
              <p className="text-gray-600 text-sm">
                {language === 'en' 
                  ? 'Explore the complete Cameroonian primary school curriculum with competence-based approach and African context'
                  : 'Explorez le curriculum complet de l\'école primaire camerounaise avec l\'approche par compétences et le contexte africain'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAutoQuizGenerator(true)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Zap className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Auto Quiz Generator' : 'Générateur de Quiz Auto'}
            </button>
            <button
              onClick={() => setShowAutoLessonPlanGenerator(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Auto Lesson Plan' : 'Plan de Leçon Auto'}
            </button>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'fr')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Select language"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md text-sm ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md text-sm ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'School System' : 'Système Scolaire'}
            </label>
            <select
              value={selectedSystem}
              onChange={(e) => setSelectedSystem(e.target.value as SchoolSystem)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Select school system"
            >
              {systems.map(system => (
                <option key={system.value} value={system.value}>
                  {system.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Class Level' : 'Niveau de Classe'}
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as PrimaryLevel)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Select class level"
            >
              {levels.map(level => (
                <option key={level} value={level}>
                  {getClassDisplayName(level, selectedSystem)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Subject' : 'Matière'}
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Select subject"
            >
              <option value="">{language === 'en' ? 'All Subjects' : 'Toutes les Matières'}</option>
              {allSubjects.map(subject => (
                <option key={subject.code} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Learning Theme' : 'Thème d\'Apprentissage'}
            </label>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value as LearningTheme | '')}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Search Topics' : 'Rechercher des Sujets'}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'en' ? 'Search lessons, topics...' : 'Rechercher des leçons, sujets...'}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">
          {language === 'en' ? 'Current System Overview' : 'Aperçu du Système Actuel'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-blue-800 font-medium">
              {language === 'en' ? 'System:' : 'Système:'} {getSystemDescription(selectedSystem)}
            </p>
          </div>
          <div>
            <p className="text-blue-800 font-medium">
              {language === 'en' ? 'Class:' : 'Classe:'} {getClassDisplayName(selectedLevel, selectedSystem)}
            </p>
          </div>
          <div>
            <p className="text-blue-800 font-medium">
              {language === 'en' ? 'Subjects:' : 'Matières:'} {subjects.length} {language === 'en' ? 'available' : 'disponibles'}
            </p>
          </div>
          <div>
            <p className="text-blue-800 font-medium">
              {language === 'en' ? 'Theme:' : 'Thème:'} {selectedTheme ? getThemeLabel(selectedTheme, selectedSystem) : (language === 'en' ? 'All Themes' : 'Tous les Thèmes')}
            </p>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'en' ? 'Search Results' : 'Résultats de Recherche'} ({searchResults.length})
          </h3>
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((topic: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{topic.title}</h4>
                      <p className="text-gray-600 mb-3">{topic.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {topic.duration} {language === 'en' ? 'minutes' : 'minutes'}
                        </span>
                        <span className="flex items-center">
                          <Target className="h-4 w-4 mr-1" />
                          {topic.competenceType}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleLessonSelect(topic)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center text-sm"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {language === 'en' ? 'View' : 'Voir'}
                      </button>
                      <button
                        onClick={() => handleQuizGenerate(topic)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center text-sm"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {language === 'en' ? 'Quiz' : 'Quiz'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {language === 'en' ? 'No topics found matching your search.' : 'Aucun sujet trouvé correspondant à votre recherche.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Curriculum Integration Test */}
      <div className="mb-8">  
        {/* <CameroonianCurriculumTest /> */}
      </div>

      {/* Curriculum Quick Access */}
      <div className="mb-8">
        <CurriculumQuickAccess 
          onNavigateToCurriculum={() => {
            // Already in curriculum browser, no need to navigate
            console.log('Already in curriculum browser');
          }}
          onLessonSelect={(lesson) => {
            console.log('Selected lesson:', lesson);
            // You can add toast notification here if needed
          }}
          onQuizGenerate={(topic) => {
            console.log('Generate quiz for:', topic);
            handleQuizGenerate(topic);
          }}
        />
      </div>

      {/* Curriculum Content */}
      {!searchQuery && (
        <div className="space-y-6">
          {/* General Competences */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              {language === 'en' ? 'General Competences' : 'Compétences Générales'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[].map((competence: string, index: number) => (
                <div key={index} className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-blue-800 text-sm">{competence}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-Cutting Issues */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-green-600" />
              {language === 'en' ? 'Cross-Cutting Issues' : 'Questions Transversales'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[].map((issue: string, index: number) => (
                <div key={index} className="bg-green-50 p-3 rounded-lg">
                  <p className="text-green-800 text-sm">{issue}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Subjects and Topics */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
              {language === 'en' ? 'Subjects and Topics' : 'Matières et Sujets'}
            </h3>
            <div className="space-y-6">
              {subjects.map((subject: any, subjectIndex: number) => (
                <div key={subjectIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{subject.name}</h4>
                      <p className="text-gray-600 text-sm">Subject Code: {subject.code}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleQuizGenerate(subject)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center text-sm"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {language === 'en' ? 'Generate Quiz' : 'Générer Quiz'}
                      </button>
                    </div>
                  </div>

                  {/* Topics - Currently not available */}
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-gray-600 text-sm">
                        {language === 'en' ? 'Topics will be available in future updates' : 'Les sujets seront disponibles dans les futures mises à jour'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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

      {showAutoLessonPlanGenerator && (
        <AutoLessonPlanGenerator
          onClose={() => setShowAutoLessonPlanGenerator(false)}
          onSave={(lessonPlan) => {
            console.log('Lesson plan saved:', lessonPlan);
            // You can add toast notification here
            setShowAutoLessonPlanGenerator(false);
          }}
        />
      )}

      {showAutoQuizGenerator && (
        <AutoQuizGenerator
          onClose={() => setShowAutoQuizGenerator(false)}
          onStartQuiz={(quiz: any) => {
            console.log('Quiz generated:', quiz);
            setShowAutoQuizGenerator(false);
            handleStartQuiz(quiz);
          }}
        />
      )}
    </div>
  );
};

export default CurriculumBrowser;
