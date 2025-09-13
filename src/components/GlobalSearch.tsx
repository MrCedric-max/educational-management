import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, BookOpen, FileText, Upload, HelpCircle, Calendar, Tag, User, Star, Download, Eye, Clock, ChevronRight } from 'lucide-react';
import { useContentLibrary } from '../contexts/ContentLibraryContext';
import { useCameroonianEducation } from '../contexts/CameroonianEducationContext';
import { useAnglophoneCurriculum } from '../contexts/AnglophoneCurriculumContext';
import { useFileManagement } from '../contexts/FileManagementContext';
import { useAuth } from '../contexts/AuthContext';

interface SearchResult {
  id: string;
  type: 'content' | 'curriculum' | 'file' | 'lesson' | 'quiz' | 'scheme' | 'weekly-plan';
  title: string;
  description: string;
  content: any;
  relevanceScore: number;
  matchedFields: string[];
  category: string;
  level?: string;
  subject?: string;
  system?: string;
  author?: string;
  date?: string;
  tags?: string[];
}

interface SearchFilters {
  query: string;
  types: string[];
  levels: string[];
  subjects: string[];
  systems: string[];
  authors: string[];
  dateRange: {
    start: string;
    end: string;
  };
  sortBy: 'relevance' | 'date' | 'title' | 'author';
  sortOrder: 'asc' | 'desc';
}

export const GlobalSearch: React.FC = () => {
  const { libraryContent } = useContentLibrary();
  const { CAMEROONIAN_CLASS_MAPPING, getSubjects } = useCameroonianEducation();
  const { curriculumData } = useAnglophoneCurriculum();
  const { files } = useFileManagement();
  const { user } = useAuth();

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    types: [],
    levels: [],
    subjects: [],
    systems: [],
    authors: [],
    dateRange: { start: '', end: '' },
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Mock lesson plans and quizzes data (replace with actual data from your contexts)
  const [lessonPlans] = useState<any[]>([
    {
      id: 'lesson-1',
      title: 'Introduction to Mathematics',
      subject: 'Mathematics',
      level: 'Level I',
      system: 'anglophone',
      objectives: ['Learn basic counting', 'Understand numbers 1-10'],
      content: 'Basic mathematics concepts for young learners',
      author: 'Teacher John',
      createdAt: '2024-01-15'
    },
    {
      id: 'lesson-2',
      title: 'English Grammar Basics',
      subject: 'English Language',
      level: 'Level II',
      system: 'anglophone',
      objectives: ['Learn basic grammar rules', 'Practice sentence structure'],
      content: 'Introduction to English grammar for intermediate students',
      author: 'Teacher Mary',
      createdAt: '2024-01-20'
    }
  ]);
  
  const [quizzes] = useState<any[]>([
    {
      id: 'quiz-1',
      title: 'Math Quiz - Addition',
      subject: 'Mathematics',
      level: 'Level I',
      system: 'anglophone',
      instructions: 'Complete the addition problems',
      questions: [
        { question: 'What is 2 + 3?', options: ['4', '5', '6'], correct: 1 },
        { question: 'What is 1 + 1?', options: ['1', '2', '3'], correct: 1 }
      ],
      author: 'Teacher John',
      createdAt: '2024-01-16'
    },
    {
      id: 'quiz-2',
      title: 'English Vocabulary Test',
      subject: 'English Language',
      level: 'Level II',
      system: 'anglophone',
      instructions: 'Choose the correct word meaning',
      questions: [
        { question: 'What does "happy" mean?', options: ['Sad', 'Joyful', 'Angry'], correct: 1 }
      ],
      author: 'Teacher Mary',
      createdAt: '2024-01-21'
    }
  ]);

  const searchResults = useMemo(() => {
    const query = searchFilters.query.trim().toLowerCase();
    const results: SearchResult[] = [];

    // If no query and no filters, return empty results
    if (!query && searchFilters.types.length === 0 && searchFilters.levels.length === 0 && 
        searchFilters.subjects.length === 0 && searchFilters.systems.length === 0) {
      return [];
    }

    // Search Content Library
    if (searchFilters.types.length === 0 || searchFilters.types.includes('content')) {
      libraryContent.forEach(content => {
        const matchedFields: string[] = [];
        let relevanceScore = 0;

        // If there's a query, check for matches
        if (query) {
          if (content.title?.toLowerCase().includes(query)) {
            matchedFields.push('title');
            relevanceScore += 10;
          }
          if (content.description?.toLowerCase().includes(query)) {
            matchedFields.push('description');
            relevanceScore += 8;
          }
          if (content.tags?.some((tag: string) => tag.toLowerCase().includes(query))) {
            matchedFields.push('tags');
            relevanceScore += 5;
          }
          if (content.subject?.toLowerCase().includes(query)) {
            matchedFields.push('subject');
            relevanceScore += 7;
          }
        } else {
          // If no query, include all content (will be filtered later)
          relevanceScore = 1;
        }

        if (relevanceScore > 0) {
          results.push({
            id: content.id,
            type: 'content',
            title: content.title || 'Untitled Content',
            description: content.description || 'No description available',
            content,
            relevanceScore,
            matchedFields,
            category: content.type || 'General',
            level: content.level,
            subject: content.subject,
            system: content.system,
            author: content.author,
            date: content.createdAt,
            tags: content.tags
          });
        }
      });
    }

    // Search Anglophone Curriculum - Schemes of Work
    if (searchFilters.types.length === 0 || searchFilters.types.includes('scheme')) {
      curriculumData.schemesOfWork?.forEach(scheme => {
        const matchedFields: string[] = [];
        let relevanceScore = 0;

        // If there's a query, check for matches
        if (query) {
          if (scheme.topic?.toLowerCase().includes(query)) {
            matchedFields.push('topic');
            relevanceScore += 10;
          }
          if (scheme.objectives?.some(obj => obj.toLowerCase().includes(query))) {
            matchedFields.push('objectives');
            relevanceScore += 8;
          }
          if (scheme.content?.some(content => content.toLowerCase().includes(query))) {
            matchedFields.push('content');
            relevanceScore += 6;
          }
          if (scheme.activities?.some(activity => activity.toLowerCase().includes(query))) {
            matchedFields.push('activities');
            relevanceScore += 5;
          }
        } else {
          // If no query, include all schemes (will be filtered later)
          relevanceScore = 1;
        }

        if (relevanceScore > 0) {
          results.push({
            id: `scheme-${scheme.id}`,
            type: 'scheme',
            title: scheme.topic || 'Untitled Scheme',
            description: scheme.objectives?.join(', ') || 'No description available',
            content: scheme,
            relevanceScore,
            matchedFields,
            category: 'Anglophone Curriculum',
            level: scheme.levelId,
            subject: scheme.subjectId,
            system: 'anglophone',
            author: 'Ministry of Education',
            date: new Date().toISOString(),
            tags: ['scheme', 'curriculum', 'anglophone']
          });
        }
      });
    }

    // Search Anglophone Curriculum - Weekly Plans
    if (searchFilters.types.length === 0 || searchFilters.types.includes('weekly-plan')) {
      curriculumData.weeklyPlans?.forEach(plan => {
        const matchedFields: string[] = [];
        let relevanceScore = 0;

        // If there's a query, check for matches
        if (query) {
          if (plan.theme?.toLowerCase().includes(query)) {
            matchedFields.push('theme');
            relevanceScore += 10;
          }
          if (plan.learningOutcomes?.some(outcome => outcome.toLowerCase().includes(query))) {
            matchedFields.push('learningOutcomes');
            relevanceScore += 8;
          }
          if (plan.subThemes?.some(subTheme => subTheme.toLowerCase().includes(query))) {
            matchedFields.push('subThemes');
            relevanceScore += 6;
          }
          if (plan.crossCurricularLinks?.some(link => link.toLowerCase().includes(query))) {
            matchedFields.push('crossCurricularLinks');
            relevanceScore += 5;
          }
        } else {
          // If no query, include all weekly plans (will be filtered later)
          relevanceScore = 1;
        }

        if (relevanceScore > 0) {
          results.push({
            id: `weekly-${plan.id}`,
            type: 'weekly-plan',
            title: plan.theme || 'Untitled Weekly Plan',
            description: plan.learningOutcomes?.join(', ') || 'No description available',
            content: plan,
            relevanceScore,
            matchedFields,
            category: 'Anglophone Curriculum',
            level: plan.levelId,
            subject: plan.subjectId,
            system: 'anglophone',
            author: 'Ministry of Education',
            date: new Date().toISOString(),
            tags: ['weekly-plan', 'curriculum', 'anglophone']
          });
        }
      });
    }

    // Search File Manager
    if (searchFilters.types.length === 0 || searchFilters.types.includes('file')) {
      files.forEach(file => {
        const matchedFields: string[] = [];
        let relevanceScore = 0;

        // If there's a query, check for matches
        if (query) {
          if (file.name?.toLowerCase().includes(query)) {
            matchedFields.push('name');
            relevanceScore += 10;
          }
          if (file.description?.toLowerCase().includes(query)) {
            matchedFields.push('description');
            relevanceScore += 8;
          }
          if (file.category?.toLowerCase().includes(query)) {
            matchedFields.push('category');
            relevanceScore += 6;
          }
          if (file.tags?.some(tag => tag.toLowerCase().includes(query))) {
            matchedFields.push('tags');
            relevanceScore += 5;
          }
        } else {
          // If no query, include all files (will be filtered later)
          relevanceScore = 1;
        }

        if (relevanceScore > 0) {
          results.push({
            id: file.id,
            type: 'file',
            title: file.name || 'Untitled File',
            description: file.description || 'No description available',
            content: file,
            relevanceScore,
            matchedFields,
            category: file.category || 'General',
            level: undefined,
            subject: undefined,
            system: undefined,
            author: file.uploadedBy,
            date: file.uploadedAt instanceof Date ? file.uploadedAt.toISOString() : file.uploadedAt,
            tags: file.tags
          });
        }
      });
    }

    // Search Lesson Plans
    if (searchFilters.types.length === 0 || searchFilters.types.includes('lesson')) {
      lessonPlans.forEach(lesson => {
        const matchedFields: string[] = [];
        let relevanceScore = 0;

        // If there's a query, check for matches
        if (query) {
          if (lesson.title?.toLowerCase().includes(query)) {
            matchedFields.push('title');
            relevanceScore += 10;
          }
          if (lesson.subject?.toLowerCase().includes(query)) {
            matchedFields.push('subject');
            relevanceScore += 8;
          }
          if (lesson.objectives?.some((obj: string) => obj.toLowerCase().includes(query))) {
            matchedFields.push('objectives');
            relevanceScore += 7;
          }
          if (lesson.content?.toLowerCase().includes(query)) {
            matchedFields.push('content');
            relevanceScore += 6;
          }
        } else {
          // If no query, include all lesson plans (will be filtered later)
          relevanceScore = 1;
        }

        if (relevanceScore > 0) {
          results.push({
            id: lesson.id,
            type: 'lesson',
            title: lesson.title || 'Untitled Lesson',
            description: lesson.objectives?.join(', ') || 'No description available',
            content: lesson,
            relevanceScore,
            matchedFields,
            category: 'Lesson Plans',
            level: lesson.level,
            subject: lesson.subject,
            system: lesson.system,
            author: lesson.author,
            date: lesson.createdAt,
            tags: ['lesson', 'plan']
          });
        }
      });
    }

    // Search Quizzes
    if (searchFilters.types.length === 0 || searchFilters.types.includes('quiz')) {
      quizzes.forEach(quiz => {
        const matchedFields: string[] = [];
        let relevanceScore = 0;

        // If there's a query, check for matches
        if (query) {
          if (quiz.title?.toLowerCase().includes(query)) {
            matchedFields.push('title');
            relevanceScore += 10;
          }
          if (quiz.subject?.toLowerCase().includes(query)) {
            matchedFields.push('subject');
            relevanceScore += 8;
          }
          if (quiz.instructions?.toLowerCase().includes(query)) {
            matchedFields.push('instructions');
            relevanceScore += 7;
          }
          if (quiz.questions?.some((q: any) => q.question?.toLowerCase().includes(query))) {
            matchedFields.push('questions');
            relevanceScore += 6;
          }
        } else {
          // If no query, include all quizzes (will be filtered later)
          relevanceScore = 1;
        }

        if (relevanceScore > 0) {
          results.push({
            id: quiz.id,
            type: 'quiz',
            title: quiz.title || 'Untitled Quiz',
            description: quiz.instructions || 'No description available',
            content: quiz,
            relevanceScore,
            matchedFields,
            category: 'Quizzes',
            level: quiz.level,
            subject: quiz.subject,
            system: quiz.system,
            author: quiz.author,
            date: quiz.createdAt,
            tags: ['quiz', 'assessment']
          });
        }
      });
    }

    // Apply additional filters
    let filteredResults = results;

    // Debug logging
    console.log('Filtering debug:', {
      totalResults: results.length,
      filters: {
        types: searchFilters.types,
        levels: searchFilters.levels,
        subjects: searchFilters.subjects,
        systems: searchFilters.systems
      }
    });

    if (searchFilters.levels.length > 0) {
      const beforeCount = filteredResults.length;
      filteredResults = filteredResults.filter(result => {
        if (!result.level) return false;
        // Map level IDs to level names for comparison
        const levelName = result.level === 'level-1' ? 'Level I' : 
                         result.level === 'level-2' ? 'Level II' : 
                         result.level === 'level-3' ? 'Level III' : result.level;
        return searchFilters.levels.includes(levelName);
      });
      console.log(`Level filter: ${beforeCount} -> ${filteredResults.length} results`);
    }

    if (searchFilters.subjects.length > 0) {
      const beforeCount = filteredResults.length;
      filteredResults = filteredResults.filter(result => {
        if (!result.subject) return false;
        // Map subject IDs to subject names for comparison
        const subjectName = result.subject.includes('english') ? 'English Language' :
                           result.subject.includes('mathematics') ? 'Mathematics' :
                           result.subject.includes('science') ? 'Science and Technology' :
                           result.subject.includes('francais') ? 'Français' :
                           result.subject.includes('social') ? 'Social Studies' :
                           result.subject.includes('vocational') ? 'Vocational Studies' :
                           result.subject.includes('arts') ? 'Arts' :
                           result.subject.includes('pe') ? 'Physical Education and Sports' :
                           result.subject.includes('national') ? 'National Languages and Cultures' :
                           result.subject.includes('ict') ? 'Information and Communication Technologies' :
                           result.subject;
        return searchFilters.subjects.includes(subjectName);
      });
      console.log(`Subject filter: ${beforeCount} -> ${filteredResults.length} results`);
    }

    if (searchFilters.systems.length > 0) {
      const beforeCount = filteredResults.length;
      filteredResults = filteredResults.filter(result => 
        result.system && searchFilters.systems.includes(result.system)
      );
      console.log(`System filter: ${beforeCount} -> ${filteredResults.length} results`);
    }

    if (searchFilters.authors.length > 0) {
      filteredResults = filteredResults.filter(result => 
        result.author && searchFilters.authors.includes(result.author)
      );
    }

    // Sort results
    filteredResults.sort((a, b) => {
      let comparison = 0;
      
      switch (searchFilters.sortBy) {
        case 'relevance':
          comparison = b.relevanceScore - a.relevanceScore;
          break;
        case 'date':
          comparison = new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'author':
          comparison = (a.author || '').localeCompare(b.author || '');
          break;
      }

      return searchFilters.sortOrder === 'asc' ? -comparison : comparison;
    });

    return filteredResults;
  }, [searchFilters, libraryContent, curriculumData, files, lessonPlans, quizzes]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'content': return <FileText className="w-4 h-4" />;
      case 'curriculum': return <BookOpen className="w-4 h-4" />;
      case 'file': return <Upload className="w-4 h-4" />;
      case 'lesson': return <Calendar className="w-4 h-4" />;
      case 'quiz': return <HelpCircle className="w-4 h-4" />;
      case 'scheme': return <BookOpen className="w-4 h-4" />;
      case 'weekly-plan': return <Calendar className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'content': return 'bg-blue-100 text-blue-800';
      case 'curriculum': return 'bg-green-100 text-green-800';
      case 'file': return 'bg-purple-100 text-purple-800';
      case 'lesson': return 'bg-orange-100 text-orange-800';
      case 'quiz': return 'bg-red-100 text-red-800';
      case 'scheme': return 'bg-green-100 text-green-800';
      case 'weekly-plan': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is now automatic via useMemo, no need for manual trigger
  };

  const clearFilters = () => {
    setSearchFilters(prev => ({
      ...prev,
      query: '',
      types: [],
      levels: [],
      subjects: [],
      systems: [],
      authors: []
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Global Search
          </h1>
          <p className="text-gray-600">
            Search across all content libraries, curriculum, file manager, lesson plans, and quizzes
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchFilters.query}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, query: e.target.value }))}
                  placeholder="Search across all content..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button
                type="submit"
                disabled={!searchFilters.query.trim() || isSearching}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="border-t pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Content Types */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Types
                    </label>
                    <div className="space-y-2">
                      {['content', 'scheme', 'weekly-plan', 'file', 'lesson', 'quiz'].map(type => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={searchFilters.types.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSearchFilters(prev => ({
                                  ...prev,
                                  types: [...prev.types, type]
                                }));
                              } else {
                                setSearchFilters(prev => ({
                                  ...prev,
                                  types: prev.types.filter(t => t !== type)
                                }));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">
                            {type.replace('-', ' ')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Levels */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Levels
                    </label>
                    <div className="space-y-2">
                      {['Level I', 'Level II', 'Level III'].map(level => (
                        <label key={level} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={searchFilters.levels.includes(level)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSearchFilters(prev => ({
                                  ...prev,
                                  levels: [...prev.levels, level]
                                }));
                              } else {
                                setSearchFilters(prev => ({
                                  ...prev,
                                  levels: prev.levels.filter(l => l !== level)
                                }));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Subjects */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subjects
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {[
                        'English Language', 'Mathematics', 'Science and Technology', 
                        'Français', 'Social Studies', 'Vocational Studies', 
                        'Arts', 'Physical Education and Sports', 
                        'National Languages and Cultures', 'Information and Communication Technologies'
                      ].map(subject => (
                        <label key={subject} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={searchFilters.subjects.includes(subject)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSearchFilters(prev => ({
                                  ...prev,
                                  subjects: [...prev.subjects, subject]
                                }));
                              } else {
                                setSearchFilters(prev => ({
                                  ...prev,
                                  subjects: prev.subjects.filter(s => s !== subject)
                                }));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{subject}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Systems */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Systems
                    </label>
                    <div className="space-y-2">
                      {['anglophone', 'francophone'].map(system => (
                        <label key={system} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={searchFilters.systems.includes(system)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSearchFilters(prev => ({
                                  ...prev,
                                  systems: [...prev.systems, system]
                                }));
                              } else {
                                setSearchFilters(prev => ({
                                  ...prev,
                                  systems: prev.systems.filter(s => s !== system)
                                }));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">{system}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <div className="space-y-2">
                      <select
                        value={searchFilters.sortBy}
                        onChange={(e) => setSearchFilters(prev => ({ 
                          ...prev, 
                          sortBy: e.target.value as any 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        title="Sort by"
                      >
                        <option value="relevance">Relevance</option>
                        <option value="date">Date</option>
                        <option value="title">Title</option>
                        <option value="author">Author</option>
                      </select>
                      <select
                        value={searchFilters.sortOrder}
                        onChange={(e) => setSearchFilters(prev => ({ 
                          ...prev, 
                          sortOrder: e.target.value as any 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        title="Sort order"
                      >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Search Results */}
        <div className="space-y-4">
          {searchResults.length > 0 ? (
            <>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Sorted by {searchFilters.sortBy}</span>
                  <span>•</span>
                  <span>{searchFilters.sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}</span>
                </div>
              </div>

              {/* Debug Info - Remove this in production */}
              {(searchFilters.types.length > 0 || searchFilters.levels.length > 0 || searchFilters.subjects.length > 0 || searchFilters.systems.length > 0) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                  <p className="font-medium text-yellow-800 mb-1">Active Filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {searchFilters.types.length > 0 && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                        Types: {searchFilters.types.join(', ')}
                      </span>
                    )}
                    {searchFilters.levels.length > 0 && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                        Levels: {searchFilters.levels.join(', ')}
                      </span>
                    )}
                    {searchFilters.subjects.length > 0 && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                        Subjects: {searchFilters.subjects.join(', ')}
                      </span>
                    )}
                    {searchFilters.systems.length > 0 && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                        Systems: {searchFilters.systems.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                          {getTypeIcon(result.type)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {result.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="capitalize">{result.type.replace('-', ' ')}</span>
                            {result.category && <span>• {result.category}</span>}
                            {result.level && <span>• {result.level}</span>}
                            {result.subject && <span>• {result.subject}</span>}
                            {result.system && <span>• {result.system}</span>}
                            {result.author && <span>• {result.author}</span>}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {result.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span>Relevance: {result.relevanceScore}</span>
                        </div>
                        {result.matchedFields.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag className="w-4 h-4" />
                            <span>Matched: {result.matchedFields.join(', ')}</span>
                          </div>
                        )}
                        {result.date && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(result.date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {result.tags && result.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {result.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : searchFilters.query.trim() ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start searching</h3>
              <p className="text-gray-600">
                Enter a search term to find content across all libraries, curriculum, files, lesson plans, and quizzes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
