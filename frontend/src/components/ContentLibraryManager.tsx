import React, { useState } from "react";
import { BookOpen, Upload, Download, Trash2, Users, Shield, FileText, HelpCircle, GraduationCap, Search, Filter, Plus, Eye, Edit, MoreVertical } from "lucide-react";
import { useContentLibrary } from "../contexts/ContentLibraryContext";
import { useCameroonianEducation } from "../contexts/CameroonianEducationContext";
import { useAuth } from "../contexts/AuthContext";

const ContentLibraryManager: React.FC = () => {
  const { libraryContent, deleteContent, analytics } = useContentLibrary();
  const { CAMEROONIAN_CLASS_MAPPING, getSubjects } = useCameroonianEducation();
  const { user } = useAuth();
  
  const [selectedSystem, setSelectedSystem] = useState<string>("anglophone");
  const [selectedLevel, setSelectedLevel] = useState<string>("1");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"content" | "access" | "analytics">("content");

  // Filter content based on selections
  const filteredContent = libraryContent.filter((content: any) => {
    const matchesSystem = content.system === selectedSystem;
    const matchesLevel = content.level === selectedLevel;
    const matchesSubject = !selectedSubject || content.subject === selectedSubject;
    const matchesSearch = !searchQuery || 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.tags.some((tag: any) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSystem && matchesLevel && matchesSubject && matchesSearch;
  });

  const subjects = getSubjects(selectedLevel as any, selectedSystem as any);

  // Check if user has permission to access this component
  if (!user || user.role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the Content Library Manager.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Content Library Management</h1>
          </div>
          <p className="text-gray-600">Manage educational content, user access, and analytics</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("content")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "content"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Content Management
              </button>
              <button
                onClick={() => setActiveTab("access")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "access"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                User Access
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "analytics"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>
        </div>

        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School System</label>
                  <select
                    value={selectedSystem}
                    onChange={(e) => setSelectedSystem(e.target.value as any)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Select school system"
                  >
                    <option value="anglophone">Anglophone</option>
                    <option value="francophone">Francophone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class Level</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Select class level"
                  >
                    {Object.entries(CAMEROONIAN_CLASS_MAPPING[selectedSystem as keyof typeof CAMEROONIAN_CLASS_MAPPING]).map(([level, name]) => (
                      <option key={level} value={level}>{name as string}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Select subject"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map((subject: any) => (
                      <option key={subject.code} value={subject.name}>{subject.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search content..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Content ({filteredContent.length} items)
                  </h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Content
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredContent.map((content: any) => (
                  <div key={content.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <h4 className="text-lg font-semibold text-gray-900">{content.title}</h4>
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {content.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{content.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" />
                            {content.subject} - {CAMEROONIAN_CLASS_MAPPING[content.system as keyof typeof CAMEROONIAN_CLASS_MAPPING][content.level as keyof typeof CAMEROONIAN_CLASS_MAPPING.anglophone]}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {content.analytics.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {content.analytics.downloads} downloads
                          </span>
                          <span>v{content.version}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          {content.tags.map((tag: any, index: any) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button className="p-1 text-gray-400 hover:text-gray-600" aria-label="View content">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600" aria-label="Edit content">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteContent(content.id)}
                          className="p-1 text-red-400 hover:text-red-600"
                          aria-label="Delete content"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600" aria-label="More options">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Access Tab */}
        {activeTab === "access" && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Access Management</h3>
            <p className="text-gray-600">Manage user permissions and access to content.</p>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Content</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalContent}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <Eye className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalViews}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <Download className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalDownloads}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <Shield className="w-8 h-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Rating</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.averageRating.toFixed(1)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentLibraryManager;