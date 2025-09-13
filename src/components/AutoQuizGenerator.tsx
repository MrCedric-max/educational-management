import React, { useState } from 'react';
import { 
  Zap, BookOpen, Clock, Target, Users, Settings, 
  Play, Save, X, Plus, Trash2, Eye, Calendar, Award, Edit
} from 'lucide-react';
import { useCameroonianEducation } from '../contexts/CameroonianEducationContext';
import { useCameroonianCurriculum } from '../contexts/CameroonianCurriculumContext';
import { useAuth } from '../contexts/AuthContext';
import { SchoolSystem, PrimaryLevel } from '../contexts/CameroonianEducationContext';
import toast from 'react-hot-toast';

interface AutoQuizGeneratorProps {
  onClose: () => void;
  onStartQuiz: (quiz: any) => void;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'short_answer';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface GeneratedQuiz {
  id: string;
  title: string;
  subject: string;
  class: string;
  system: SchoolSystem;
  level: string;
  topic: string;
  duration: number;
  totalQuestions: number;
  totalPoints: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: QuizQuestion[];
  instructions: string;
  passingScore: number;
  timeLimit: number;
  createdAt: Date;
  status: 'draft' | 'ready' | 'completed';
}

const AutoQuizGenerator: React.FC<AutoQuizGeneratorProps> = ({
  onClose,
  onStartQuiz
}) => {
  const { getClassDisplayName, getSubjects, getAgeForLevel } = useCameroonianEducation();
  const { language } = useAuth();
  const { getCompetenceBasedActivities, getProjectPedagogySuggestions, getAfricanContextExamples } = useCameroonianCurriculum();

  const [selectedSystem, setSelectedSystem] = useState<SchoolSystem>('anglophone');
  const [selectedLevel, setSelectedLevel] = useState<PrimaryLevel>('1');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [duration, setDuration] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const levels: PrimaryLevel[] = ['1', '2', '3', '4', '5', '6', 'SIL'];
  const subjects = getSubjects(selectedLevel, selectedSystem);

  const generateQuiz = async () => {
    if (!lessonTitle.trim() || !selectedSubject || !topic.trim()) {
      toast.error(language === 'en' ? 'Please fill in all required fields' : 'Veuillez remplir tous les champs requis');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate competence-based activities and African context
      const competenceActivities = getCompetenceBasedActivities(selectedSubject, selectedLevel, selectedSystem);
      const africanExamples = getAfricanContextExamples(selectedSubject, selectedLevel, selectedSystem);

      // Generate quiz questions based on lesson content
      const questions = generateQuestions(lessonTitle, selectedSubject, selectedLevel, topic, difficulty, questionCount, africanExamples);

      const quiz: GeneratedQuiz = {
        id: `quiz_${Date.now()}`,
        title: `${lessonTitle} - ${topic}`,
        subject: selectedSubject,
        class: getClassDisplayName(selectedLevel, selectedSystem),
        system: selectedSystem,
        level: selectedLevel,
        topic: topic,
        duration: duration,
        totalQuestions: questions.length,
        totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
        difficulty: difficulty,
        questions: questions,
        instructions: generateInstructions(selectedSubject, selectedLevel, duration),
        passingScore: Math.ceil(questions.length * 0.6), // 60% passing score
        timeLimit: duration * 60, // Convert minutes to seconds
        createdAt: new Date(),
        status: 'ready'
      };

      setGeneratedQuiz(quiz);
      setIsEditing(true);
      toast.success(language === 'en' ? 'Quiz generated successfully!' : 'Quiz généré avec succès!');
    } catch (error) {
      toast.error(language === 'en' ? 'Error generating quiz' : 'Erreur lors de la génération du quiz');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateQuestions = (title: string, subject: string, level: PrimaryLevel, topic: string, difficulty: string, count: number, africanExamples: string[]): QuizQuestion[] => {
    const questions: QuizQuestion[] = [];
    const questionTypes: QuizQuestion['type'][] = ['multiple_choice', 'true_false', 'fill_blank', 'short_answer'];

    for (let i = 0; i < count; i++) {
      const questionType = questionTypes[i % questionTypes.length];
      const questionData = generateQuestionData(title, subject, level, topic, questionType, difficulty, i + 1, africanExamples);
      questions.push(questionData);
    }

    return questions;
  };

  const generateQuestionData = (title: string, subject: string, level: PrimaryLevel, topic: string, type: QuizQuestion['type'], difficulty: string, questionNumber: number, africanExamples: string[]): QuizQuestion => {
    const baseQuestion = {
      id: `q${questionNumber}`,
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      points: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3
    };

    switch (type) {
      case 'multiple_choice':
        return {
          ...baseQuestion,
          question: generateMultipleChoiceQuestion(title, subject, topic, questionNumber),
          type: 'multiple_choice',
          options: generateMultipleChoiceOptions(title, subject, topic),
          correctAnswer: 0,
          explanation: generateExplanation(title, subject, topic, 'multiple_choice')
        };

      case 'true_false':
        return {
          ...baseQuestion,
          question: generateTrueFalseQuestion(title, subject, topic, questionNumber),
          type: 'true_false',
          options: ['True', 'False'],
          correctAnswer: Math.random() > 0.5 ? 0 : 1,
          explanation: generateExplanation(title, subject, topic, 'true_false')
        };

      case 'fill_blank':
        return {
          ...baseQuestion,
          question: generateFillBlankQuestion(title, subject, topic, questionNumber),
          type: 'fill_blank',
          correctAnswer: generateFillBlankAnswer(title, subject, topic),
          explanation: generateExplanation(title, subject, topic, 'fill_blank')
        };

      case 'short_answer':
        return {
          ...baseQuestion,
          question: generateShortAnswerQuestion(title, subject, topic, questionNumber),
          type: 'short_answer',
          correctAnswer: generateShortAnswerAnswer(title, subject, topic),
          explanation: generateExplanation(title, subject, topic, 'short_answer')
        };

      default:
        return {
          ...baseQuestion,
          question: `Question ${questionNumber} about ${topic}`,
          type: 'short_answer',
          correctAnswer: 'Answer',
          explanation: 'This is the correct answer.'
        };
    }
  };

  const generateMultipleChoiceQuestion = (title: string, subject: string, topic: string, questionNumber: number): string => {
    const questionTemplates = [
      `What is the main purpose of ${topic.toLowerCase()}?`,
      `Which of the following best describes ${topic.toLowerCase()}?`,
      `In the context of ${title.toLowerCase()}, what does ${topic.toLowerCase()} represent?`,
      `What is the correct way to ${topic.toLowerCase()}?`,
      `Which statement about ${topic.toLowerCase()} is most accurate?`
    ];
    return questionTemplates[questionNumber % questionTemplates.length];
  };

  const generateMultipleChoiceOptions = (title: string, subject: string, topic: string): string[] => {
    return [
      `The correct answer about ${topic.toLowerCase()}`,
      `An incorrect option related to ${topic.toLowerCase()}`,
      `Another incorrect option for ${topic.toLowerCase()}`,
      `A partially correct option about ${topic.toLowerCase()}`
    ];
  };

  const generateTrueFalseQuestion = (title: string, subject: string, topic: string, questionNumber: number): string => {
    const questionTemplates = [
      `${topic} is an important concept in ${subject}.`,
      `The method described in ${title} is always effective.`,
      `${topic} can be applied in different situations.`,
      `Students should understand ${topic} before moving to the next topic.`,
      `${topic} is only relevant in certain contexts.`
    ];
    return questionTemplates[questionNumber % questionTemplates.length];
  };

  const generateFillBlankQuestion = (title: string, subject: string, topic: string, questionNumber: number): string => {
    const questionTemplates = [
      `The main concept in ${title} is _______.`,
      `To understand ${topic}, students need to know about _______.`,
      `The key principle of ${topic} is _______.`,
      `In the context of ${subject}, ${topic} involves _______.`,
      `The most important aspect of ${topic} is _______.`
    ];
    return questionTemplates[questionNumber % questionTemplates.length];
  };

  const generateFillBlankAnswer = (title: string, subject: string, topic: string): string => {
    return `the correct answer for ${topic.toLowerCase()}`;
  };

  const generateShortAnswerQuestion = (title: string, subject: string, topic: string, questionNumber: number): string => {
    const questionTemplates = [
      `Explain what ${topic} means in the context of ${title}.`,
      `Describe how ${topic} is used in ${subject}.`,
      `What are the key characteristics of ${topic}?`,
      `How does ${topic} relate to the main topic of ${title}?`,
      `Why is ${topic} important in ${subject}?`
    ];
    return questionTemplates[questionNumber % questionTemplates.length];
  };

  const generateShortAnswerAnswer = (title: string, subject: string, topic: string): string => {
    return `A comprehensive answer about ${topic.toLowerCase()} in the context of ${title.toLowerCase()}.`;
  };

  const generateExplanation = (title: string, subject: string, topic: string, type: string): string => {
    return `This question tests understanding of ${topic.toLowerCase()} in the context of ${title.toLowerCase()}. The correct answer demonstrates knowledge of key concepts in ${subject}.`;
  };

  const generateInstructions = (subject: string, level: PrimaryLevel, duration: number): string => {
    const age = getAgeForLevel(level);
    return `This quiz is designed for ${age}-year-old students in ${subject}. You have ${duration} minutes to complete all questions. Read each question carefully and choose the best answer. Good luck!`;
  };

  const handleStartQuiz = () => {
    if (generatedQuiz) {
      onStartQuiz(generatedQuiz);
    }
  };

  const updateQuestion = (questionId: string, field: keyof QuizQuestion, value: any) => {
    if (generatedQuiz) {
      const updatedQuestions = generatedQuiz.questions.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      );
      setGeneratedQuiz({
        ...generatedQuiz,
        questions: updatedQuestions,
        totalPoints: updatedQuestions.reduce((sum, q) => sum + q.points, 0)
      });
    }
  };

  const addQuestion = () => {
    if (generatedQuiz) {
      const newQuestion: QuizQuestion = {
        id: `q${generatedQuiz.questions.length + 1}`,
        question: 'New question',
        type: 'multiple_choice',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correctAnswer: 0,
        explanation: 'Explanation for the answer',
        difficulty: 'easy',
        points: 1
      };
      setGeneratedQuiz({
        ...generatedQuiz,
        questions: [...generatedQuiz.questions, newQuestion],
        totalQuestions: generatedQuiz.questions.length + 1,
        totalPoints: generatedQuiz.totalPoints + newQuestion.points
      });
    }
  };

  const removeQuestion = (questionId: string) => {
    if (generatedQuiz && generatedQuiz.questions.length > 1) {
      const questionToRemove = generatedQuiz.questions.find(q => q.id === questionId);
      const updatedQuestions = generatedQuiz.questions.filter(q => q.id !== questionId);
      setGeneratedQuiz({
        ...generatedQuiz,
        questions: updatedQuestions,
        totalQuestions: updatedQuestions.length,
        totalPoints: updatedQuestions.reduce((sum, q) => sum + q.points, 0)
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Zap className="h-6 w-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              {language === 'en' ? 'Auto Quiz Generator' : 'Générateur Automatique de Quiz'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {!generatedQuiz ? (
            /* Generation Form */
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  {language === 'en' 
                    ? 'Fill in the lesson details to automatically generate age-appropriate quiz questions based on the Cameroonian curriculum.'
                    : 'Remplissez les détails de la leçon pour générer automatiquement des questions de quiz adaptées à l\'âge basées sur le curriculum camerounais.'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'School System' : 'Système Scolaire'}
                  </label>
                  <select
                    value={selectedSystem}
                    onChange={(e) => setSelectedSystem(e.target.value as SchoolSystem)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    aria-label="Select school system"
                  >
                    <option value="anglophone">Anglophone</option>
                    <option value="francophone">Francophone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Class Level' : 'Niveau de Classe'}
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value as PrimaryLevel)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    aria-label="Select subject"
                  >
                    <option value="">{language === 'en' ? 'Select Subject' : 'Sélectionner une Matière'}</option>
                    {subjects.map(subject => (
                      <option key={subject.code} value={subject.name}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Difficulty' : 'Difficulté'}
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    aria-label="Select difficulty"
                  >
                    <option value="easy">{language === 'en' ? 'Easy' : 'Facile'}</option>
                    <option value="medium">{language === 'en' ? 'Medium' : 'Moyen'}</option>
                    <option value="hard">{language === 'en' ? 'Hard' : 'Difficile'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Number of Questions' : 'Nombre de Questions'}
                  </label>
                  <input
                    type="number"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="3"
                    max="20"
                    aria-label="Number of questions"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Duration (minutes)' : 'Durée (minutes)'}
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="5"
                    max="60"
                    aria-label="Duration in minutes"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Lesson Title' : 'Titre de la Leçon'}
                </label>
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder={language === 'en' ? 'Enter lesson title...' : 'Entrez le titre de la leçon...'}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Topic/Concept' : 'Sujet/Concept'}
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={language === 'en' ? 'Enter specific topic or concept...' : 'Entrez le sujet ou concept spécifique...'}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-center">
                <button
                  onClick={generateQuiz}
                  disabled={isGenerating || !lessonTitle.trim() || !selectedSubject || !topic.trim()}
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {language === 'en' ? 'Generating...' : 'Génération...'}
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 mr-2" />
                      {language === 'en' ? 'Generate Quiz' : 'Générer le Quiz'}
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Generated Quiz Editor */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'en' ? 'Generated Quiz' : 'Quiz Généré'}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {isEditing ? (language === 'en' ? 'View' : 'Voir') : (language === 'en' ? 'Edit' : 'Modifier')}
                  </button>
                  <button
                    onClick={handleStartQuiz}
                    className="flex items-center px-3 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    {language === 'en' ? 'Start Quiz' : 'Commencer le Quiz'}
                  </button>
                </div>
              </div>

              {/* Quiz Header */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold text-purple-900 mb-4">{generatedQuiz.title}</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Subject:</span> {generatedQuiz.subject}
                  </div>
                  <div>
                    <span className="font-semibold">Class:</span> {generatedQuiz.class}
                  </div>
                  <div>
                    <span className="font-semibold">Questions:</span> {generatedQuiz.totalQuestions}
                  </div>
                  <div>
                    <span className="font-semibold">Duration:</span> {generatedQuiz.duration} min
                  </div>
                  <div>
                    <span className="font-semibold">Difficulty:</span> {generatedQuiz.difficulty}
                  </div>
                  <div>
                    <span className="font-semibold">Points:</span> {generatedQuiz.totalPoints}
                  </div>
                  <div>
                    <span className="font-semibold">Passing Score:</span> {generatedQuiz.passingScore}
                  </div>
                  <div>
                    <span className="font-semibold">System:</span> {generatedQuiz.system}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Instructions:</h4>
                  <p className="text-purple-800">{generatedQuiz.instructions}</p>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {language === 'en' ? 'Questions' : 'Questions'} ({generatedQuiz.questions.length})
                  </h4>
                  {isEditing && (
                    <button
                      onClick={addQuestion}
                      className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {language === 'en' ? 'Add Question' : 'Ajouter Question'}
                    </button>
                  )}
                </div>

                {generatedQuiz.questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">
                          Q{index + 1}
                        </span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          {question.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {question.difficulty}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          {question.points} pts
                        </span>
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => removeQuestion(question.id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={generatedQuiz.questions.length <= 1}
                          aria-label={language === 'en' ? 'Remove question' : 'Supprimer la question'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'en' ? 'Question' : 'Question'}:
                        </label>
                        {isEditing ? (
                                                      <textarea
                              value={question.question}
                              onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                              rows={2}
                              aria-label="Question text"
                            />
                        ) : (
                          <p className="text-gray-900">{question.question}</p>
                        )}
                      </div>

                      {question.type === 'multiple_choice' && question.options && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'en' ? 'Options' : 'Options'}:
                          </label>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                                  {String.fromCharCode(65 + optionIndex)}
                                </span>
                                {isEditing ? (
                                                              <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...question.options!];
                                newOptions[optionIndex] = e.target.value;
                                updateQuestion(question.id, 'options', newOptions);
                              }}
                              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                              aria-label={`Option ${String.fromCharCode(65 + optionIndex)}`}
                            />
                                ) : (
                                  <span className={`${optionIndex === question.correctAnswer ? 'text-green-600 font-semibold' : 'text-gray-700'}`}>
                                    {option}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {question.type === 'true_false' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'en' ? 'Answer' : 'Réponse'}:
                          </label>
                          {isEditing ? (
                            <select
                              value={question.correctAnswer}
                              onChange={(e) => updateQuestion(question.id, 'correctAnswer', parseInt(e.target.value))}
                              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                              aria-label="Select correct answer"
                            >
                              <option value={0}>True</option>
                              <option value={1}>False</option>
                            </select>
                          ) : (
                            <span className="text-gray-900">
                              {question.correctAnswer === 0 ? 'True' : 'False'}
                            </span>
                          )}
                        </div>
                      )}

                      {(question.type === 'fill_blank' || question.type === 'short_answer') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'en' ? 'Correct Answer' : 'Bonne Réponse'}:
                          </label>
                          {isEditing ? (
                                                          <input
                                type="text"
                                value={question.correctAnswer as string}
                                onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                                aria-label="Correct answer"
                              />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 p-2 rounded">{question.correctAnswer}</p>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'en' ? 'Explanation' : 'Explication'}:
                        </label>
                        {isEditing ? (
                                                      <textarea
                              value={question.explanation}
                              onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                              rows={2}
                              aria-label="Explanation text"
                            />
                        ) : (
                          <p className="text-gray-700 bg-gray-50 p-2 rounded text-sm">{question.explanation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoQuizGenerator;
