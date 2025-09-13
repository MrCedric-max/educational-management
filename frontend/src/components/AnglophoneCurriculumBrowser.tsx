import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Target, 
  Users, 
  Clock, 
  FileText, 
  ChevronDown, 
  ChevronRight,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Plus
} from 'lucide-react';
import { useAnglophoneCurriculum } from '../contexts/AnglophoneCurriculumContext';
import SchemeOfWorkGenerator from './SchemeOfWorkGenerator';
import WeeklyPlanGenerator from './WeeklyPlanGenerator';

const AnglophoneCurriculumBrowser: React.FC = () => {
  const { 
    curriculumData, 
    getSubjectsByLevel, 
    getSchemesForSubject, 
    getWeeklyPlansForSubject,
    getLevels,
    getSubjects 
  } = useAnglophoneCurriculum();

  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'schemes' | 'weekly-plans'>('overview');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showSchemeGenerator, setShowSchemeGenerator] = useState(false);
  const [showWeeklyPlanGenerator, setShowWeeklyPlanGenerator] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<any>(null);

  const levels = getLevels();
  const subjects = selectedLevel ? getSubjectsByLevel(selectedLevel) : getSubjects();
  
  // Get all schemes if no specific subject is selected, otherwise filter by subject
  const allSchemes = curriculumData.schemesOfWork || [];
  const schemes = selectedSubject 
    ? getSchemesForSubject(selectedSubject, selectedLevel) 
    : selectedLevel 
      ? allSchemes.filter(scheme => scheme.levelId === selectedLevel)
      : allSchemes;
  
  // Get all weekly plans if no specific subject is selected, otherwise filter by subject  
  const allWeeklyPlans = curriculumData.weeklyPlans || [];
  const weeklyPlans = selectedSubject 
    ? getWeeklyPlansForSubject(selectedSubject, selectedLevel) 
    : selectedLevel 
      ? allWeeklyPlans.filter(plan => plan.levelId === selectedLevel)
      : allWeeklyPlans;

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const filteredSchemes = schemes.filter(scheme => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      scheme.topic?.toLowerCase().includes(query) ||
      scheme.objectives?.some(obj => obj.toLowerCase().includes(query)) ||
      scheme.content?.some(content => content.toLowerCase().includes(query)) ||
      scheme.activities?.some(activity => activity.toLowerCase().includes(query))
    );
  });

  const filteredWeeklyPlans = weeklyPlans.filter(plan => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      plan.theme?.toLowerCase().includes(query) ||
      plan.learningOutcomes?.some(outcome => outcome.toLowerCase().includes(query)) ||
      plan.subThemes?.some(subTheme => subTheme.toLowerCase().includes(query)) ||
      plan.crossCurricularLinks?.some(link => link.toLowerCase().includes(query))
    );
  });

  // Debug logging
  console.log('Debug - Schemes loaded:', {
    allSchemes: allSchemes.length,
    schemes: schemes.length,
    filteredSchemes: filteredSchemes.length,
    selectedLevel,
    selectedSubject,
    searchQuery
  });

  const renderLevelCard = (level: any) => (
    <div key={level.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{level.name}</h3>
            <p className="text-sm text-gray-600">{level.ageRange}</p>
          </div>
        </div>
        <button
          onClick={() => setSelectedLevel(level.id)}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedLevel === level.id 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {selectedLevel === level.id ? 'Selected' : 'Select'}
        </button>
      </div>
      <p className="text-gray-600 mb-4">{level.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {level.subjects.map((subject: any) => (
          <div key={subject.id} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">{subject.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{subject.description}</p>
            <div className="space-y-2">
              <div>
                <span className="text-xs font-medium text-gray-500">Key Skills:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {subject.keySkills.slice(0, 3).map((skill: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                  {subject.keySkills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{subject.keySkills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSchemeOfWork = (scheme: any) => (
    <div key={scheme.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Calendar className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">{scheme.topic}</h3>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <span>Term {scheme.term}, Week {scheme.week}</span>
            <span>•</span>
            <span>{scheme.duration} minutes</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
            <Edit className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Target className="h-4 w-4 mr-2 text-blue-600" />
            Learning Objectives
          </h4>
          <ul className="space-y-2">
            {scheme.objectives.map((objective: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-sm text-gray-700">{objective}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Users className="h-4 w-4 mr-2 text-green-600" />
            Activities
          </h4>
          <ul className="space-y-2">
            {scheme.activities.map((activity: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-sm text-gray-700">{activity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Resources</h5>
            <ul className="space-y-1">
              {scheme.resources.map((resource: string, index: number) => (
                <li key={index} className="text-sm text-gray-600">• {resource}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Assessment</h5>
            <ul className="space-y-1">
              {scheme.assessment.map((item: string, index: number) => (
                <li key={index} className="text-sm text-gray-600">• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Keywords</h5>
            <div className="flex flex-wrap gap-1">
              {scheme.keywords.map((keyword: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWeeklyPlan = (plan: any) => (
    <div key={plan.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <FileText className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">{plan.theme}</h3>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <span>Term {plan.term}, Week {plan.week}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
            <Edit className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Sub-Themes</h4>
          <div className="flex flex-wrap gap-2">
            {plan.subThemes.map((subTheme: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                {subTheme}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">Learning Outcomes</h4>
          <ul className="space-y-2">
            {plan.learningOutcomes.map((outcome: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-sm text-gray-700">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Cross-Curricular Links</h5>
            <ul className="space-y-1">
              {plan.crossCurricularLinks.map((link: string, index: number) => (
                <li key={index} className="text-sm text-gray-600">• {link}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Differentiation</h5>
            <ul className="space-y-1">
              {plan.differentiation.map((item: string, index: number) => (
                <li key={index} className="text-sm text-gray-600">• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Anglophone Curriculum Browser</h1>
            <p className="text-gray-600">Explore curriculum frameworks, schemes of work, and weekly plans</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowSchemeGenerator(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Scheme of Work
            </button>
            <button 
              onClick={() => setShowWeeklyPlanGenerator(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Weekly Plan
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search curriculum content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            title="Select level"
          >
            <option value="">All Levels</option>
            {levels.map(level => (
              <option key={level.id} value={level.id}>{level.name}</option>
            ))}
          </select>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            title="Select subject"
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BookOpen className="h-4 w-4 inline mr-2" />
              Curriculum Overview
            </button>
            <button
              onClick={() => setActiveTab('schemes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'schemes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Schemes of Work
            </button>
            <button
              onClick={() => setActiveTab('weekly-plans')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'weekly-plans'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Weekly Plans
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {levels.map(level => renderLevelCard(level))}
        </div>
      )}

      {activeTab === 'schemes' && (
        <div className="space-y-4">
          {filteredSchemes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No schemes of work found</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-blue-600 hover:text-blue-800 mt-2"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            filteredSchemes.map(scheme => renderSchemeOfWork(scheme))
          )}
        </div>
      )}

      {activeTab === 'weekly-plans' && (
        <div className="space-y-4">
          {filteredWeeklyPlans.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No weekly plans found</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-blue-600 hover:text-blue-800 mt-2"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            filteredWeeklyPlans.map(plan => renderWeeklyPlan(plan))
          )}
        </div>
      )}

      {/* Scheme of Work Generator Modal */}
      {showSchemeGenerator && (
        <SchemeOfWorkGenerator
          onClose={() => setShowSchemeGenerator(false)}
          onSave={(scheme) => {
            console.log('Scheme saved:', scheme);
            setShowSchemeGenerator(false);
          }}
        />
      )}

      {/* Weekly Plan Generator Modal */}
      {showWeeklyPlanGenerator && (
        <WeeklyPlanGenerator
          onClose={() => setShowWeeklyPlanGenerator(false)}
          onSave={(plan) => {
            console.log('Plan saved:', plan);
            setShowWeeklyPlanGenerator(false);
          }}
          selectedScheme={selectedScheme}
        />
      )}
    </div>
  );
};

export default AnglophoneCurriculumBrowser;
