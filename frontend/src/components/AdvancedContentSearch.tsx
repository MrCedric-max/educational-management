import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar, Tag, User, FileText, Star, Download, Eye, Clock } from 'lucide-react';
import { useContentLibrary } from '../contexts/ContentLibraryContext';
import { useCameroonianEducation } from '../contexts/CameroonianEducationContext';

interface SearchFilters {
  query: string;
  type: string[];
  subject: string[];
  level: string[];
  system: string[];
  tags: string[];
  author: string;
  dateRange: {
    start: string;
    end: string;
  };
  rating: {
    min: number;
    max: number;
  };
  fileSize: {
    min: number;
    max: number;
  };
  sortBy: 'relevance' | 'date' | 'title' | 'rating' | 'views' | 'downloads';
  sortOrder: 'asc' | 'desc';
}

interface SearchResult {
  content: any;
  relevanceScore: number;
  matchedFields: string[];
}

export const AdvancedContentSearch: React.FC = () => {
  const { libraryContent } = useContentLibrary();
  const { CAMEROONIAN_CLASS_MAPPING, getSubjects } = useCameroonianEducation();
  
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    type: [],
    subject: [],
    level: [],
    system: [],
    tags: [],
    author: '',
    dateRange: { start: '', end: '' },
    rating: { min: 0, max: 5 },
    fileSize: { min: 0, max: 100000000 },
    sortBy: 'relevance',
    sortOrder: 'desc'
  });
  
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const contentTypes = [
    'textbook', 'quiz_bank', 'lesson_plan', 'worksheet', 
    'assessment_rubric', 'teaching_guide', 'multimedia_resource'
  ];
  
  const allSubjects = Array.from(new Set(
    Object.values(CAMEROONIAN_CLASS_MAPPING).flatMap(levels => 
      Object.values(levels).flatMap(level => 
        getSubjects(level as any, 'anglophone').concat(getSubjects(level as any, 'francophone'))
      )
    )
  )).map((subject: {name: string, code: string}) => subject.name);

  const allTags: string[] = Array.from(new Set(
    libraryContent.flatMap((content: any) => content.tags)
  ));

  const performSearch = async () => {
    if (!searchFilters.query.trim() && searchFilters.type.length === 0 && 
        searchFilters.subject.length === 0 && searchFilters.tags.length === 0) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let results = [...libraryContent];
      
      if (searchFilters.query.trim()) {
        const query = searchFilters.query.toLowerCase();
        results = results.filter(content => 
          content.title.toLowerCase().includes(query) ||
          content.description.toLowerCase().includes(query) ||
          content.tags.some((tag: string) => tag.toLowerCase().includes(query)) ||
          content.metadata?.author?.toLowerCase().includes(query) ||
          content.metadata?.keywords?.some((keyword: string) => keyword.toLowerCase().includes(query))
        );
      }
      
      if (searchFilters.type.length > 0) {
        results = results.filter(content => searchFilters.type.includes(content.type));
      }
      
      if (searchFilters.subject.length > 0) {
        results = results.filter(content => searchFilters.subject.includes(content.subject));
      }
      
      if (searchFilters.level.length > 0) {
        results = results.filter(content => searchFilters.level.includes(content.level));
      }
      
      if (searchFilters.system.length > 0) {
        results = results.filter(content => searchFilters.system.includes(content.system));
      }
      
      if (searchFilters.tags.length > 0) {
        results = results.filter(content => 
          searchFilters.tags.some(tag => content.tags.includes(tag))
        );
      }
      
      if (searchFilters.author.trim()) {
        results = results.filter(content => 
          content.metadata?.author?.toLowerCase().includes(searchFilters.author.toLowerCase())
        );
      }
      
      if (searchFilters.dateRange.start) {
        results = results.filter(content => 
          new Date(content.createdAt) >= new Date(searchFilters.dateRange.start)
        );
      }
      if (searchFilters.dateRange.end) {
        results = results.filter(content => 
          new Date(content.createdAt) <= new Date(searchFilters.dateRange.end)
        );
      }
      
      results = results.filter(content => {
        const rating = content.analytics?.rating || 0;
        return rating >= searchFilters.rating.min && rating <= searchFilters.rating.max;
      });
      
      results = results.filter(content => {
        const size = content.fileSize || 0;
        return size >= searchFilters.fileSize.min && size <= searchFilters.fileSize.max;
      });
      
      const scoredResults = results.map(content => {
        let score = 0;
        const matchedFields: string[] = [];
        
        if (searchFilters.query.trim()) {
          const query = searchFilters.query.toLowerCase();
          
          if (content.title.toLowerCase().includes(query)) {
            score += 10;
            matchedFields.push('title');
          }
          if (content.description.toLowerCase().includes(query)) {
            score += 5;
            matchedFields.push('description');
          }
          if (content.tags.some((tag: string) => tag.toLowerCase().includes(query))) {
            score += 3;
            matchedFields.push('tags');
          }
          if (content.metadata?.author?.toLowerCase().includes(query)) {
            score += 2;
            matchedFields.push('author');
          }
        }
        
        if (searchFilters.type.includes(content.type)) score += 5;
        if (searchFilters.subject.includes(content.subject)) score += 5;
        if (searchFilters.tags.some((tag: string) => content.tags.includes(tag))) score += 3;
        
        return { content, relevanceScore: score, matchedFields };
      });
      
      scoredResults.sort((a, b) => {
        if (searchFilters.sortBy === 'relevance') {
          return searchFilters.sortOrder === 'desc' ? b.relevanceScore - a.relevanceScore : a.relevanceScore - b.relevanceScore;
        } else if (searchFilters.sortBy === 'date') {
          const dateA = new Date(a.content.createdAt).getTime();
          const dateB = new Date(b.content.createdAt).getTime();
          return searchFilters.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        } else if (searchFilters.sortBy === 'title') {
          return searchFilters.sortOrder === 'desc' ? 
            b.content.title.localeCompare(a.content.title) : 
            a.content.title.localeCompare(b.content.title);
        } else if (searchFilters.sortBy === 'rating') {
          const ratingA = a.content.analytics?.rating || 0;
          const ratingB = b.content.analytics?.rating || 0;
          return searchFilters.sortOrder === 'desc' ? ratingB - ratingA : ratingA - ratingB;
        } else if (searchFilters.sortBy === 'views') {
          const viewsA = a.content.analytics?.views || 0;
          const viewsB = b.content.analytics?.views || 0;
          return searchFilters.sortOrder === 'desc' ? viewsB - viewsA : viewsA - viewsB;
        } else if (searchFilters.sortBy === 'downloads') {
          const downloadsA = a.content.analytics?.downloads || 0;
          const downloadsB = b.content.analytics?.downloads || 0;
          return searchFilters.sortOrder === 'desc' ? downloadsB - downloadsA : downloadsA - downloadsB;
        }
        return 0;
      });
      
      setSearchResults(scoredResults);
      
      if (searchFilters.query.trim()) {
        setRecentSearches(prev => {
          const newSearches = [searchFilters.query, ...prev.filter(s => s !== searchFilters.query)].slice(0, 5);
          return newSearches;
        });
      }
      
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (searchFilters.query.length > 2) {
      const query = searchFilters.query.toLowerCase();
      const suggestions = [
        ...allSubjects.filter(subject => subject.toLowerCase().includes(query)),
        ...allTags.filter((tag: string) => tag.toLowerCase().includes(query)),
        ...contentTypes.filter(type => type.toLowerCase().includes(query))
      ].slice(0, 5);
      setSuggestions(suggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchFilters.query]);

  const clearFilters = () => {
    setSearchFilters({
      query: '',
      type: [],
      subject: [],
      level: [],
      system: [],
      tags: [],
      author: '',
      dateRange: { start: '', end: '' },
      rating: { min: 0, max: 5 },
      fileSize: { min: 0, max: 100000000 },
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
    setSearchResults([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Search className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Advanced Content Search</h1>
                <p className="text-gray-600">Find content with powerful search and filtering options</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                <Filter className="w-4 h-4" />
                <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
              </button>
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                <X className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchFilters.query}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, query: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && performSearch()}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search content by title, description, tags, author..."
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                onClick={performSearch}
                disabled={isSearching}
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setSearchFilters(prev => ({ ...prev, query: suggestion }))}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && !searchFilters.query && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchFilters(prev => ({ ...prev, query: search }))}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Content Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {contentTypes.map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={searchFilters.type.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSearchFilters(prev => ({ ...prev, type: [...prev.type, type] }));
                          } else {
                            setSearchFilters(prev => ({ ...prev, type: prev.type.filter(t => t !== type) }));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {type.replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {allSubjects.slice(0, 10).map(subject => (
                    <label key={subject} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={searchFilters.subject.includes(subject)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSearchFilters(prev => ({ ...prev, subject: [...prev.subject, subject] }));
                          } else {
                            setSearchFilters(prev => ({ ...prev, subject: prev.subject.filter(s => s !== subject) }));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {allTags.slice(0, 10).map((tag: string) => (
                    <label key={tag} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={searchFilters.tags.includes(tag)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSearchFilters(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                          } else {
                            setSearchFilters(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={searchFilters.author}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Search by author name"
                />
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={searchFilters.dateRange.start}
                    onChange={(e) => setSearchFilters(prev => ({ 
                      ...prev, 
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Start date"
                  />
                  <input
                    type="date"
                    value={searchFilters.dateRange.end}
                    onChange={(e) => setSearchFilters(prev => ({ 
                      ...prev, 
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="End date"
                  />
                </div>
              </div>

              {/* Rating Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating Range
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={searchFilters.rating.min}
                    onChange={(e) => setSearchFilters(prev => ({ 
                      ...prev, 
                      rating: { ...prev.rating, min: parseFloat(e.target.value) }
                    }))}
                    className="w-full"
                    aria-label="Minimum rating"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{searchFilters.rating.min} stars</span>
                    <span>{searchFilters.rating.max} stars</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={searchFilters.sortBy}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    aria-label="Sort by"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="date">Date Created</option>
                    <option value="title">Title</option>
                    <option value="rating">Rating</option>
                    <option value="views">Views</option>
                    <option value="downloads">Downloads</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <select
                    value={searchFilters.sortOrder}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, sortOrder: e.target.value as any }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    aria-label="Sort order"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Search Results ({searchResults.length})
            </h3>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <div key={result.content.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{result.content.title}</h4>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {result.content.type.replace('_', ' ')}
                        </span>
                        {result.relevanceScore > 0 && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {result.relevanceScore}% match
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-2">{result.content.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{result.content.metadata?.author || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(result.content.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>{result.content.subject}</span>
                        </div>
                        {result.content.fileSize && (
                          <div className="flex items-center space-x-1">
                            <span>{formatFileSize(result.content.fileSize)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{result.content.analytics?.views || 0} views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{result.content.analytics?.downloads || 0} downloads</span>
                        </div>
                        {result.content.analytics?.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>{result.content.analytics.rating.toFixed(1)} rating</span>
                          </div>
                        )}
                      </div>
                      
                      {result.matchedFields.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">Matched in: </span>
                          <span className="text-xs text-blue-600">
                            {result.matchedFields.join(', ')}
                          </span>
                        </div>
                      )}
                      
                      {result.content.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {result.content.tags.map((tag: string, tagIndex: number) => (
                            <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                        View
                      </button>
                      <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm">
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};