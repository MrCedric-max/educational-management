import React, { useState } from 'react';
import { Eye, BookOpen, Target, Users, Globe, Clock, XCircle, Play, Download } from 'lucide-react';
import { useCameroonianEducation } from '../contexts/CameroonianEducationContext';
import { useCameroonianCurriculum } from '../contexts/CameroonianCurriculumContext';
import { useAuth } from '../contexts/AuthContext';

interface LessonViewerProps {
  lesson: any;
  onClose: () => void;
  onGenerateQuiz: (lesson: any) => void;
}

const LessonViewer: React.FC<LessonViewerProps> = ({ lesson, onClose, onGenerateQuiz }) => {
  const { getClassDisplayName, getAgeForLevel } = useCameroonianEducation();
  const { getCompetenceBasedActivities, getProjectPedagogySuggestions, getAfricanContextExamples } = useCameroonianCurriculum();
  const { language } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'objectives' | 'activities' | 'resources' | 'assessment'>('overview');

  const competenceActivities = getCompetenceBasedActivities(lesson.level || '1', lesson.system || 'anglophone', lesson.subject || '');
  const projectSuggestions = getProjectPedagogySuggestions(lesson.level || '1', lesson.system || 'anglophone', lesson.subject || '');
  const africanExamples = getAfricanContextExamples(lesson.level || '1', lesson.system || 'anglophone', lesson.subject || '');

  const tabs = [
    { id: 'overview', label: language === 'en' ? 'Overview' : 'Aperçu', icon: BookOpen },
    { id: 'objectives', label: language === 'en' ? 'Objectives' : 'Objectifs', icon: Target },
    { id: 'activities', label: language === 'en' ? 'Activities' : 'Activités', icon: Users },
    { id: 'resources', label: language === 'en' ? 'Resources' : 'Ressources', icon: Download },
    { id: 'assessment', label: language === 'en' ? 'Assessment' : 'Évaluation', icon: Target }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {language === 'en' ? 'Lesson Description' : 'Description de la Leçon'}
              </h3>
              <p className="text-gray-700">{lesson.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  {language === 'en' ? 'Duration' : 'Durée'}
                </h4>
                <p className="text-blue-800 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {lesson.duration} {language === 'en' ? 'minutes' : 'minutes'}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">
                  {language === 'en' ? 'Competence Type' : 'Type de Compétence'}
                </h4>
                <p className="text-green-800 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  {lesson.competenceType}
                </p>
              </div>
            </div>

            {lesson.africanContext && lesson.africanContext.length > 0 && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2 flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'African Context' : 'Contexte Africain'}
                </h4>
                <ul className="space-y-1">
                  {lesson.africanContext.map((context: string, index: number) => (
                    <li key={index} className="text-orange-800 text-sm flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      {context}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lesson.projectPedagogy && lesson.projectPedagogy.length > 0 && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Project Pedagogy' : 'Pédagogie de Projet'}
                </h4>
                <ul className="space-y-1">
                  {lesson.projectPedagogy.map((project: string, index: number) => (
                    <li key={index} className="text-purple-800 text-sm flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      {project}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'objectives':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Learning Objectives' : 'Objectifs d\'Apprentissage'}
            </h3>
            <ul className="space-y-3">
              {lesson.objectives && lesson.objectives.map((objective: string, index: number) => (
                <li key={index} className="flex items-start">
                  <Target className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{objective}</span>
                </li>
              ))}
            </ul>

            {competenceActivities.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  {language === 'en' ? 'Competence-Based Objectives' : 'Objectifs Basés sur les Compétences'}
                </h4>
                <ul className="space-y-2">
                  {competenceActivities.slice(0, 5).map((activity: string, index: number) => (
                    <li key={index} className="text-orange-700 text-sm flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'activities':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Learning Activities' : 'Activités d\'Apprentissage'}
            </h3>
            <ul className="space-y-3">
              {lesson.activities && lesson.activities.map((activity: string, index: number) => (
                <li key={index} className="flex items-start">
                  <Users className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{activity}</span>
                </li>
              ))}
            </ul>

            {projectSuggestions.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  {language === 'en' ? 'Project Pedagogy Activities' : 'Activités de Pédagogie de Projet'}
                </h4>
                <ul className="space-y-2">
                  {projectSuggestions.slice(0, 5).map((suggestion: string, index: number) => (
                    <li key={index} className="text-purple-700 text-sm flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Required Resources' : 'Ressources Requises'}
            </h3>
            <ul className="space-y-3">
              {lesson.resources && lesson.resources.map((resource: string, index: number) => (
                <li key={index} className="flex items-start">
                  <Download className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{resource}</span>
                </li>
              ))}
            </ul>

            {africanExamples.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  {language === 'en' ? 'African Context Resources' : 'Ressources de Contexte Africain'}
                </h4>
                <ul className="space-y-2">
                  {africanExamples.slice(0, 5).map((example: string, index: number) => (
                    <li key={index} className="text-red-700 text-sm flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'assessment':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Assessment Methods' : 'Méthodes d\'Évaluation'}
            </h3>
            <ul className="space-y-3">
              {lesson.assessment && lesson.assessment.map((method: string, index: number) => (
                <li key={index} className="flex items-start">
                  <Target className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{method}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                {language === 'en' ? 'Assessment Tips' : 'Conseils d\'Évaluation'}
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• {language === 'en' ? 'Use age-appropriate assessment methods' : 'Utilisez des méthodes d\'évaluation adaptées à l\'âge'}</li>
                <li>• {language === 'en' ? 'Include both formative and summative assessments' : 'Incluez des évaluations formatives et sommatives'}</li>
                <li>• {language === 'en' ? 'Consider cultural context in assessment' : 'Considérez le contexte culturel dans l\'évaluation'}</li>
                <li>• {language === 'en' ? 'Provide constructive feedback' : 'Fournissez des commentaires constructifs'}</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{lesson.title}</h2>
              <p className="text-gray-600 text-sm">{lesson.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onGenerateQuiz(lesson)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center text-sm"
            >
              <Play className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Generate Quiz' : 'Générer Quiz'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close lesson viewer"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
