import React, { useState } from 'react';
import { Play, Clock, Target, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { useCameroonianEducation } from '../contexts/CameroonianEducationContext';
import { useCameroonianCurriculum } from '../contexts/CameroonianCurriculumContext';
import { useAuth } from '../contexts/AuthContext';
import { SchoolSystem, PrimaryLevel } from '../contexts/CameroonianEducationContext';

interface QuizGeneratorProps {
  topic: any;
  onClose: () => void;
  onStartQuiz: (quiz: any) => void;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ topic, onClose, onStartQuiz }) => {
  const { getClassDisplayName, getAgeForLevel } = useCameroonianEducation();
  const { getCompetenceBasedActivities, getProjectPedagogySuggestions, getAfricanContextExamples } = useCameroonianCurriculum();
  const { language } = useAuth();

  const [quizConfig, setQuizConfig] = useState({
    duration: 5, // minutes
    questionCount: 5,
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    includeCompetenceBased: true,
    includeProjectPedagogy: true,
    includeAfricanContext: true
  });

  const generateQuiz = () => {
    const age = getAgeForLevel(topic.level || '1');
    const competenceActivities = getCompetenceBasedActivities(topic.level || '1', topic.system || 'anglophone', topic.subject || '');
    const projectSuggestions = getProjectPedagogySuggestions(topic.level || '1', topic.system || 'anglophone', topic.subject || '');
    const africanExamples = getAfricanContextExamples(topic.level || '1', topic.system || 'anglophone', topic.subject || '');

    // Generate questions based on topic and age
    const questions = generateQuestions(topic, age, quizConfig, {
      competenceActivities,
      projectSuggestions,
      africanExamples
    });

    const quiz = {
      id: `quiz_${Date.now()}`,
      title: `${topic.title} - ${language === 'en' ? 'Quiz' : 'Quiz'}`,
      description: topic.description,
      duration: quizConfig.duration,
      questionCount: quizConfig.questionCount,
      difficulty: quizConfig.difficulty,
      questions,
      topic: topic,
      createdAt: new Date(),
      isGenerated: true
    };

    onStartQuiz(quiz);
  };

  const generateQuestions = (topic: any, age: number, config: any, context: any) => {
    const questions = [];
    const questionTypes = ['multiple_choice', 'true_false', 'fill_blank'];
    
    for (let i = 0; i < config.questionCount; i++) {
      const questionType = questionTypes[i % questionTypes.length];
      const question = generateQuestion(topic, age, questionType, i + 1, context);
      questions.push(question);
    }

    return questions;
  };

  const generateQuestion = (topic: any, age: number, type: string, questionNumber: number, context: any) => {
    const baseQuestion = {
      id: `q_${questionNumber}`,
      type,
      questionNumber,
      topic: topic.title
    };

    switch (type) {
      case 'multiple_choice':
        return {
          ...baseQuestion,
          question: generateMultipleChoiceQuestion(topic, age, context),
          options: generateMultipleChoiceOptions(topic, age),
          correctAnswer: 0
        };
      case 'true_false':
        return {
          ...baseQuestion,
          question: generateTrueFalseQuestion(topic, age, context),
          options: [
            { id: 'true', text: language === 'en' ? 'True' : 'Vrai' },
            { id: 'false', text: language === 'en' ? 'False' : 'Faux' }
          ],
          correctAnswer: 0
        };
      case 'fill_blank':
        return {
          ...baseQuestion,
          question: generateFillBlankQuestion(topic, age, context),
          correctAnswer: generateFillBlankAnswer(topic, age)
        };
      default:
        return baseQuestion;
    }
  };

  const generateMultipleChoiceQuestion = (topic: any, age: number, context: any) => {
    const questions = [
      language === 'en' 
        ? `What is the main objective of ${topic.title}?`
        : `Quel est l'objectif principal de ${topic.title}?`,
      language === 'en'
        ? `Which activity is most suitable for ${age}-year-olds in ${topic.title}?`
        : `Quelle activité est la plus appropriée pour les enfants de ${age} ans dans ${topic.title}?`,
      language === 'en'
        ? `How does ${topic.title} relate to Cameroonian culture?`
        : `Comment ${topic.title} se rapporte-t-il à la culture camerounaise?`
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  };

  const generateMultipleChoiceOptions = (topic: any, age: number) => {
    const options = [
      { id: 'a', text: language === 'en' ? 'Develop basic skills' : 'Développer les compétences de base' },
      { id: 'b', text: language === 'en' ? 'Advanced learning' : 'Apprentissage avancé' },
      { id: 'c', text: language === 'en' ? 'Cultural understanding' : 'Compréhension culturelle' },
      { id: 'd', text: language === 'en' ? 'All of the above' : 'Toutes les réponses ci-dessus' }
    ];
    return options;
  };

  const generateTrueFalseQuestion = (topic: any, age: number, context: any) => {
    const questions = [
      language === 'en'
        ? `${topic.title} is appropriate for ${age}-year-old students.`
        : `${topic.title} est approprié pour les étudiants de ${age} ans.`,
      language === 'en'
        ? `Competence-based learning is important in ${topic.title}.`
        : `L'apprentissage basé sur les compétences est important dans ${topic.title}.`,
      language === 'en'
        ? `African context should be included in ${topic.title}.`
        : `Le contexte africain devrait être inclus dans ${topic.title}.`
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  };

  const generateFillBlankQuestion = (topic: any, age: number, context: any) => {
    const questions = [
      language === 'en'
        ? `The main goal of ${topic.title} is to _____ students' understanding.`
        : `L'objectif principal de ${topic.title} est de _____ la compréhension des étudiants.`,
      language === 'en'
        ? `Students in ${topic.title} should develop _____ skills.`
        : `Les étudiants dans ${topic.title} devraient développer des compétences _____.`
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  };

  const generateFillBlankAnswer = (topic: any, age: number) => {
    const answers = [
      language === 'en' ? 'enhance' : 'améliorer',
      language === 'en' ? 'critical thinking' : 'pensée critique',
      language === 'en' ? 'practical' : 'pratiques'
    ];
    return answers[Math.floor(Math.random() * answers.length)];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Play className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">
              {language === 'en' ? 'Generate Quiz' : 'Générer Quiz'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close quiz generator"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">{topic.title}</h3>
          <p className="text-gray-600 text-sm">{topic.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Duration (minutes)' : 'Durée (minutes)'}
            </label>
            <select
              value={quizConfig.duration}
              onChange={(e) => setQuizConfig({...quizConfig, duration: parseInt(e.target.value)})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              aria-label="Select quiz duration"
            >
              <option value={5}>5 {language === 'en' ? 'minutes' : 'minutes'}</option>
              <option value={10}>10 {language === 'en' ? 'minutes' : 'minutes'}</option>
              <option value={15}>15 {language === 'en' ? 'minutes' : 'minutes'}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Number of Questions' : 'Nombre de Questions'}
            </label>
            <select
              value={quizConfig.questionCount}
              onChange={(e) => setQuizConfig({...quizConfig, questionCount: parseInt(e.target.value)})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              aria-label="Select number of questions"
            >
              <option value={5}>5 {language === 'en' ? 'questions' : 'questions'}</option>
              <option value={10}>10 {language === 'en' ? 'questions' : 'questions'}</option>
              <option value={15}>15 {language === 'en' ? 'questions' : 'questions'}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Difficulty Level' : 'Niveau de Difficulté'}
            </label>
            <select
              value={quizConfig.difficulty}
              onChange={(e) => setQuizConfig({...quizConfig, difficulty: e.target.value as 'easy' | 'medium' | 'hard'})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              aria-label="Select difficulty level"
            >
              <option value="easy">{language === 'en' ? 'Easy' : 'Facile'}</option>
              <option value="medium">{language === 'en' ? 'Medium' : 'Moyen'}</option>
              <option value="hard">{language === 'en' ? 'Hard' : 'Difficile'}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Age Group' : 'Groupe d\'Âge'}
            </label>
            <div className="p-2 bg-gray-50 rounded-md">
              <span className="text-sm text-gray-600">
                {getAgeForLevel(topic.level || '1')} {language === 'en' ? 'years old' : 'ans'}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            {language === 'en' ? 'Include Context' : 'Inclure le Contexte'}
          </h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={quizConfig.includeCompetenceBased}
                onChange={(e) => setQuizConfig({...quizConfig, includeCompetenceBased: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                {language === 'en' ? 'Competence-based activities' : 'Activités basées sur les compétences'}
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={quizConfig.includeProjectPedagogy}
                onChange={(e) => setQuizConfig({...quizConfig, includeProjectPedagogy: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                {language === 'en' ? 'Project pedagogy elements' : 'Éléments de pédagogie de projet'}
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={quizConfig.includeAfricanContext}
                onChange={(e) => setQuizConfig({...quizConfig, includeAfricanContext: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                {language === 'en' ? 'African context examples' : 'Exemples de contexte africain'}
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {language === 'en' ? 'Cancel' : 'Annuler'}
          </button>
          <button
            onClick={generateQuiz}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            <Play className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Generate & Start Quiz' : 'Générer et Commencer le Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizGenerator;
