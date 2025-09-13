import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'lesson_plan' | 'quiz' | 'worksheet' | 'video' | 'document';
  subject: string;
  level: string;
  system: 'anglophone' | 'francophone';
  tags: string[];
  author: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  fileSize: number;
  rating: number;
  metadata?: {
    author?: string;
    keywords?: string[];
  };
  analytics: {
    views: number;
    downloads: number;
    likes: number;
    rating: number;
  };
}

export interface ContentLibraryAnalytics {
  totalContent: number;
  totalViews: number;
  totalDownloads: number;
  averageRating: number;
}

export interface BulkUploadJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalFiles: number;
  processedFiles: number;
  errors: string[];
  createdAt: string;
}

export interface ContentLibraryContextType {
  libraryContent: ContentItem[];
  analytics: ContentLibraryAnalytics;
  bulkUploadJobs: BulkUploadJob[];
  addContent: (content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt' | 'analytics'>) => void;
  updateContent: (id: string, updates: Partial<ContentItem>) => void;
  deleteContent: (id: string) => void;
  getContentById: (id: string) => ContentItem | undefined;
  searchContent: (query: string, filters?: {
    type?: string[];
    subject?: string[];
    level?: string[];
    system?: string[];
    tags?: string[];
  }) => ContentItem[];
  startBulkUpload: (files: File[], metadata: any) => Promise<string>;
  getBulkUploadJobs: () => BulkUploadJob[];
}

// Mock data
const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'Mathematics Lesson Plan - Addition',
    description: 'A comprehensive lesson plan for teaching addition to primary students',
    type: 'lesson_plan',
    subject: 'Mathematics',
    level: '1',
    system: 'anglophone',
    tags: ['addition', 'primary', 'mathematics'],
    author: 'John Doe',
    version: '1.0',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    fileSize: 1024,
    rating: 4.5,
    analytics: {
      views: 150,
      downloads: 45,
      likes: 12,
      rating: 4.5
    }
  },
  {
    id: '2',
    title: 'French Vocabulary Quiz',
    description: 'Interactive quiz for French vocabulary learning',
    type: 'quiz',
    subject: 'French',
    level: '2',
    system: 'francophone',
    tags: ['vocabulary', 'french', 'quiz'],
    author: 'Marie Dubois',
    version: '1.2',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-22T09:15:00Z',
    fileSize: 2048,
    rating: 4.2,
    analytics: {
      views: 200,
      downloads: 78,
      likes: 18,
      rating: 4.2
    }
  }
];

// Context
const ContentLibraryContext = createContext<ContentLibraryContextType | undefined>(undefined);

// Provider
export const ContentLibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [libraryContent, setLibraryContent] = useState<ContentItem[]>(mockContent);
  const [bulkUploadJobs, setBulkUploadJobs] = useState<BulkUploadJob[]>([]);

  const analytics: ContentLibraryAnalytics = {
    totalContent: libraryContent.length,
    totalViews: libraryContent.reduce((sum, content) => sum + content.analytics.views, 0),
    totalDownloads: libraryContent.reduce((sum, content) => sum + content.analytics.downloads, 0),
    averageRating: libraryContent.length > 0 
      ? libraryContent.reduce((sum, content) => sum + content.rating, 0) / libraryContent.length 
      : 0
  };

  const addContent = (contentData: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt' | 'analytics'>) => {
    const newContent: ContentItem = {
      ...contentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      analytics: {
        views: 0,
        downloads: 0,
        likes: 0,
        rating: 0
      }
    };
    setLibraryContent(prev => [...prev, newContent]);
  };

  const updateContent = (id: string, updates: Partial<ContentItem>) => {
    setLibraryContent(prev => 
      prev.map(content => 
        content.id === id 
          ? { ...content, ...updates, updatedAt: new Date().toISOString() }
          : content
      )
    );
  };

  const deleteContent = (id: string) => {
    setLibraryContent(prev => prev.filter(content => content.id !== id));
  };

  const getContentById = (id: string) => {
    return libraryContent.find(content => content.id === id);
  };

  const searchContent = (query: string, filters?: {
    type?: string[];
    subject?: string[];
    level?: string[];
    system?: string[];
    tags?: string[];
  }) => {
    let results = libraryContent;

    // Apply text search
    if (query) {
      const searchLower = query.toLowerCase();
      results = results.filter(content => 
        content.title.toLowerCase().includes(searchLower) ||
        content.description.toLowerCase().includes(searchLower) ||
        content.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply filters
    if (filters) {
      if (filters.type && filters.type.length > 0) {
        results = results.filter(content => filters.type!.includes(content.type));
      }
      if (filters.subject && filters.subject.length > 0) {
        results = results.filter(content => filters.subject!.includes(content.subject));
      }
      if (filters.level && filters.level.length > 0) {
        results = results.filter(content => filters.level!.includes(content.level));
      }
      if (filters.system && filters.system.length > 0) {
        results = results.filter(content => filters.system!.includes(content.system));
      }
      if (filters.tags && filters.tags.length > 0) {
        results = results.filter(content => 
          filters.tags!.some(tag => content.tags.includes(tag))
        );
      }
    }

    return results;
  };

  const startBulkUpload = async (files: File[], metadata: any): Promise<string> => {
    const jobId = Date.now().toString();
    const newJob: BulkUploadJob = {
      id: jobId,
      status: 'pending',
      progress: 0,
      totalFiles: files.length,
      processedFiles: 0,
      errors: [],
      createdAt: new Date().toISOString()
    };
    
    setBulkUploadJobs(prev => [...prev, newJob]);
    
    // Simulate bulk upload process
    setTimeout(() => {
      setBulkUploadJobs(prev => 
        prev.map(job => 
          job.id === jobId 
            ? { ...job, status: 'processing', progress: 50 }
            : job
        )
      );
    }, 1000);
    
    setTimeout(() => {
      setBulkUploadJobs(prev => 
        prev.map(job => 
          job.id === jobId 
            ? { ...job, status: 'completed', progress: 100, processedFiles: files.length }
            : job
        )
      );
    }, 3000);
    
    return jobId;
  };

  const getBulkUploadJobs = (): BulkUploadJob[] => {
    return bulkUploadJobs;
  };

  const value: ContentLibraryContextType = {
    libraryContent,
    analytics,
    bulkUploadJobs,
    addContent,
    updateContent,
    deleteContent,
    getContentById,
    searchContent,
    startBulkUpload,
    getBulkUploadJobs
  };

  return (
    <ContentLibraryContext.Provider value={value}>
      {children}
    </ContentLibraryContext.Provider>
  );
};

// Custom Hook
export const useContentLibrary = (): ContentLibraryContextType => {
  const context = useContext(ContentLibraryContext);
  if (context === undefined) {
    throw new Error('useContentLibrary must be used within a ContentLibraryProvider');
  }
  return context;
};

export default ContentLibraryProvider;





