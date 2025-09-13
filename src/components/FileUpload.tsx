import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, FileText, Download, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
  category: 'template' | 'resource' | 'image' | 'document';
}

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  onFileRemove: (fileId: string) => void;
  uploadedFiles: UploadedFile[];
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  category?: 'template' | 'resource' | 'image' | 'document';
  multiple?: boolean;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  onFileRemove,
  uploadedFiles = [],
  maxFileSize = 10, // 10MB default
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx'],
  category = 'resource',
  multiple = true,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (fileType.includes('word') || fileType.includes('document')) return <FileText className="h-5 w-5 text-blue-600" />;
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return <FileText className="h-5 w-5 text-orange-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxFileSize}MB`);
      return false;
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type.match(type.replace('*', '.*'));
    });

    if (!isValidType) {
      toast.error(`File type not supported. Accepted types: ${acceptedTypes.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleFileUpload = useCallback(async (files: FileList) => {
    setIsUploading(true);
    
    try {
      const fileArray = Array.from(files);
      
      for (const file of fileArray) {
        if (!validateFile(file)) continue;

        // Call the parent's onFileUpload with the File object
        onFileUpload(file);
        toast.success(`File "${file.name}" uploaded successfully!`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  }, [onFileUpload, maxFileSize, acceptedTypes, category]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (fileId: string) => {
    onFileRemove(fileId);
    toast.success('File removed successfully!');
  };

  const handleDownloadFile = (file: UploadedFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewFile = (file: UploadedFile) => {
    window.open(file.url, '_blank');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            {isDragOver ? 'Drop files here' : 'Upload files'}
          </p>
          <p className="text-sm text-gray-500">
            Drag and drop files here, or{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              browse files
            </button>
          </p>
          <p className="text-xs text-gray-400">
            Max file size: {maxFileSize}MB • Accepted types: {acceptedTypes.join(', ')}
          </p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="File upload input"
        />
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Uploaded Files ({uploadedFiles.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewFile(file)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="View file"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadFile(file)}
                    className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                    title="Download file"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove file"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
