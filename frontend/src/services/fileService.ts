import apiService from './api';
import toast from 'react-hot-toast';

export interface FileUploadResponse {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  category: 'template' | 'resource' | 'image' | 'document';
  uploadedAt: string;
  uploadedBy: string;
}

export interface FileListResponse {
  files: FileUploadResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class FileService {
  async uploadFile(
    file: File,
    category: 'template' | 'resource' | 'image' | 'document',
    metadata?: {
      lessonId?: string;
      quizId?: string;
      description?: string;
      tags?: string[];
    }
  ): Promise<FileUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      
      if (metadata) {
        if (metadata.lessonId) formData.append('lessonId', metadata.lessonId);
        if (metadata.quizId) formData.append('quizId', metadata.quizId);
        if (metadata.description) formData.append('description', metadata.description);
        if (metadata.tags) formData.append('tags', JSON.stringify(metadata.tags));
      }

      const response = await apiService.uploadFile(formData as any);
      toast.success(`File "${file.name}" uploaded successfully!`);
      return (response as any).data || response as any;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      throw error;
    }
  }

  async getFiles(params?: {
    page?: number;
    limit?: number;
    category?: 'template' | 'resource' | 'image' | 'document';
    lessonId?: string;
    quizId?: string;
    search?: string;
  }): Promise<FileListResponse> {
    try {
      const response = await apiService.getFiles(params as any);
      return { files: (response as any).data || [] } as FileListResponse;
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to fetch files');
      throw error;
    }
  }

  async getFile(id: string): Promise<FileUploadResponse> {
    try {
      const response = await apiService.getFile(id);
      return (response as any).data || response as any;
    } catch (error) {
      console.error('Error fetching file:', error);
      toast.error('Failed to fetch file');
      throw error;
    }
  }

  async deleteFile(id: string): Promise<void> {
    try {
      await apiService.deleteFile(id);
      toast.success('File deleted successfully!');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
      throw error;
    }
  }

  async updateFileMetadata(
    id: string,
    metadata: {
      name?: string;
      description?: string;
      tags?: string[];
      category?: 'template' | 'resource' | 'image' | 'document';
    }
  ): Promise<FileUploadResponse> {
    try {
      const response = await apiService.updateFileMetadata(id, metadata);
      toast.success('File metadata updated successfully!');
      return (response as any).data || response as any;
    } catch (error) {
      console.error('Error updating file metadata:', error);
      toast.error('Failed to update file metadata');
      throw error;
    }
  }

  // Helper method to get file download URL
  getFileDownloadUrl(fileId: string): string {
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/files/${fileId}/download`;
  }

  // Helper method to get file preview URL
  getFilePreviewUrl(fileId: string): string {
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/files/${fileId}/preview`;
  }

  // Helper method to validate file before upload
  validateFile(file: File, maxSizeMB: number = 10): { isValid: boolean; error?: string } {
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      return {
        isValid: false,
        error: `File size must be less than ${maxSizeMB}MB`
      };
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'File type not supported. Please upload images, PDFs, Word documents, PowerPoint presentations, or text files.'
      };
    }

    return { isValid: true };
  }

  // Helper method to format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Helper method to get file icon based on type
  getFileIcon(fileType: string): string {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.includes('pdf')) return 'pdf';
    if (fileType.includes('word') || fileType.includes('document')) return 'word';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'powerpoint';
    if (fileType.includes('text')) return 'text';
    return 'file';
  }
}

export const fileService = new FileService();
export default fileService;

