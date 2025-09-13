import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Target, Globe, Users, Clock, Filter } from 'lucide-react';
import { useCameroonianEducation } from '../contexts/CameroonianEducationContext';
import { useCameroonianCurriculum } from '../contexts/CameroonianCurriculumContext';
import { SchoolSystem, PrimaryLevel } from '../contexts/CameroonianEducationContext';

interface LessonSearchProps {
  onLessonSelect?: (lesson: any) => void;
}

const LessonSearch: React.FC<LessonSearchProps> = ({ onLessonSelect }) => {
  const { getClassDisplayName, getSubjects, getSystemDescription } = useCameroonianEducation();
  const { getCompetenceBasedActivities, getProjectPedagogySuggestions, getAfricanContextExamples } = useCameroonianCurriculum();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<PrimaryLevel>('1');
  const [selectedSystem, setSelectedSystem] = useState<SchoolSystem>('anglophone');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const levels: PrimaryLevel[] = ['1', '2', '3', '4', '5', '6'];
  const systems: { value: SchoolSystem; label: string }[] = [
    { value: 'anglophone', label: 'Anglophone' },
    { value: 'francophone', label: 'Francophone' }
  ];

  const subjects = getSubjects(selectedLevel, selectedSystem);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, selectedLevel, selectedSystem, selectedSubject]);

  const performSearch = async () => {
    setIsSearching(true);
    try {
      // Simple search through available subjects
      const subjects = getSubjects(selectedLevel, selectedSystem);
      const results = subjects.filter(subject => 
        subject.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLessonSelect = (lesson: any) => {
    if (onLessonSelect) {
      onLessonSelect(lesson);
    }
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <BookOpen className="mr-2 h-6 w-6 text-blue-600" />
          Cameroonian Primary School Lesson Search
        </h2>

        {/* Search Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School System
            </label>
            <select
              value={selectedSystem}
              onChange={(e) => setSelectedSystem(e.target.value as SchoolSystem)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              Class Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as PrimaryLevel)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject.code} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Query
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lessons, topics, activities..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* System Description */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Current System</h3>
          <p className="text-blue-800 text-sm">{getSystemDescription(selectedSystem)}</p>
        </div>

        {/* Search Results */}
        {isSearching && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Searching lessons...</span>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Found {searchResults.length} lesson(s)
            </h3>
            {searchResults.map((lesson, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{lesson.title}</h4>
                    <p className="text-gray-600 mb-2">{lesson.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {lesson.duration} minutes
                      </span>
                      <span className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        {lesson.competenceType}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLessonSelect(lesson)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Select Lesson
                  </button>
                </div>

                {/* Objectives */}
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Learning Objectives</h5>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {lesson.objectives.map((objective: string, idx: number) => (
                      <li key={idx}>{objective}</li>
                    ))}
                  </ul>
                </div>

                {/* Activities */}
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Activities</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {lesson.activities.map((activity: string, idx: number) => (
                      <div key={idx} className="bg-gray-50 p-2 rounded text-sm">
                        {activity}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competence-Based Activities */}
                {getCompetenceActivities(lesson.title).length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Target className="h-4 w-4 mr-2 text-green-600" />
                      Competence-Based Activities
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {getCompetenceActivities(lesson.title).slice(0, 4).map((activity: string, idx: number) => (
                        <div key={idx} className="bg-green-50 p-2 rounded text-sm border-l-4 border-green-400">
                          {activity}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Pedagogy */}
                {getProjectSuggestions(lesson.title).length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-purple-600" />
                      Project Pedagogy Suggestions
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {getProjectSuggestions(lesson.title).slice(0, 4).map((suggestion: string, idx: number) => (
                        <div key={idx} className="bg-purple-50 p-2 rounded text-sm border-l-4 border-purple-400">
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* African Context Examples */}
                {getAfricanExamples(lesson.title).length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-orange-600" />
                      African Context Examples
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {getAfricanExamples(lesson.title).slice(0, 4).map((example: string, idx: number) => (
                        <div key={idx} className="bg-orange-50 p-2 rounded text-sm border-l-4 border-orange-400">
                          {example}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {searchQuery && !isSearching && searchResults.length === 0 && (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No lessons found matching your search criteria.</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonSearch;






