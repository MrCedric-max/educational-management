import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fileService, FileUploadResponse } from '../services/fileService';
import toast from 'react-hot-toast';

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  category: 'template' | 'resource' | 'image' | 'document';
  uploadedAt: Date;
  uploadedBy: string;
  description?: string;
  tags?: string[];
  lessonId?: string;
  quizId?: string;
}

interface FileManagementContextType {
  files: FileMetadata[];
  isLoading: boolean;
  uploadFile: (
    file: File,
    category: 'template' | 'resource' | 'image' | 'document',
    metadata?: {
      lessonId?: string;
      quizId?: string;
      description?: string;
      tags?: string[];
    }
  ) => Promise<void>;
  removeFile: (fileId: string) => Promise<void>;
  updateFileMetadata: (
    fileId: string,
    metadata: {
      name?: string;
      description?: string;
      tags?: string[];
      category?: 'template' | 'resource' | 'image' | 'document';
    }
  ) => Promise<void>;
  getFilesByCategory: (category: 'template' | 'resource' | 'image' | 'document') => FileMetadata[];
  getFilesByLesson: (lessonId: string) => FileMetadata[];
  getFilesByQuiz: (quizId: string) => FileMetadata[];
  searchFiles: (query: string) => FileMetadata[];
  refreshFiles: () => Promise<void>;
}

const FileManagementContext = createContext<FileManagementContextType | undefined>(undefined);

interface FileManagementProviderProps {
  children: ReactNode;
}

export const FileManagementProvider: React.FC<FileManagementProviderProps> = ({ children }) => {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load files on component mount
  useEffect(() => {
    refreshFiles();
  }, []);

  const refreshFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fileService.getFiles();
      const fileData: FileMetadata[] = response.files.map((file: FileUploadResponse) => ({
        ...file,
        uploadedAt: new Date(file.uploadedAt),
      }));
      setFiles(fileData);
    } catch (error) {
      console.error('Error loading files:', error);
      toast.error('Failed to load files');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (
    file: File,
    category: 'template' | 'resource' | 'image' | 'document',
    metadata?: {
      lessonId?: string;
      quizId?: string;
      description?: string;
      tags?: string[];
    }
  ) => {
    try {
      setIsLoading(true);
      
      // Validate file before upload
      const validation = fileService.validateFile(file);
      if (!validation.isValid) {
        toast.error(validation.error || 'Invalid file');
        return;
      }

      const uploadedFile = await fileService.uploadFile(file, category, metadata);
      
      const newFile: FileMetadata = {
        ...uploadedFile,
        uploadedAt: new Date(uploadedFile.uploadedAt),
      };
      
      setFiles(prev => [newFile, ...prev]);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = async (fileId: string) => {
    try {
      setIsLoading(true);
      await fileService.deleteFile(fileId);
      setFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (error) {
      console.error('Error removing file:', error);
      toast.error('Failed to remove file');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFileMetadata = async (
    fileId: string,
    metadata: {
      name?: string;
      description?: string;
      tags?: string[];
      category?: 'template' | 'resource' | 'image' | 'document';
    }
  ) => {
    try {
      setIsLoading(true);
      const updatedFile = await fileService.updateFileMetadata(fileId, metadata);
      
      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, ...updatedFile, uploadedAt: new Date(updatedFile.uploadedAt) }
          : file
      ));
    } catch (error) {
      console.error('Error updating file metadata:', error);
      toast.error('Failed to update file metadata');
    } finally {
      setIsLoading(false);
    }
  };

  const getFilesByCategory = (category: 'template' | 'resource' | 'image' | 'document'): FileMetadata[] => {
    return files.filter(file => file.category === category);
  };

  const getFilesByLesson = (lessonId: string): FileMetadata[] => {
    return files.filter(file => file.lessonId === lessonId);
  };

  const getFilesByQuiz = (quizId: string): FileMetadata[] => {
    return files.filter(file => file.quizId === quizId);
  };

  const searchFiles = (query: string): FileMetadata[] => {
    if (!query.trim()) return files;
    
    const lowercaseQuery = query.toLowerCase();
    return files.filter(file => 
      file.name.toLowerCase().includes(lowercaseQuery) ||
      file.description?.toLowerCase().includes(lowercaseQuery) ||
      file.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const value: FileManagementContextType = {
    files,
    isLoading,
    uploadFile,
    removeFile,
    updateFileMetadata,
    getFilesByCategory,
    getFilesByLesson,
    getFilesByQuiz,
    searchFiles,
    refreshFiles,
  };

  return (
    <FileManagementContext.Provider value={value}>
      {children}
    </FileManagementContext.Provider>
  );
};

export const useFileManagement = (): FileManagementContextType => {
  const context = useContext(FileManagementContext);
  if (context === undefined) {
    throw new Error('useFileManagement must be used within a FileManagementProvider');
  }
  return context;
};

export default FileManagementContext;





