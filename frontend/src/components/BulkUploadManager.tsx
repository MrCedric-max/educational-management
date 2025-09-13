import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Download, Trash2 } from 'lucide-react';
import { useContentLibrary } from '../contexts/ContentLibraryContext';
import { useCameroonianEducation } from '../contexts/CameroonianEducationContext';
import { SchoolSystem } from '../contexts/CameroonianEducationContext';

export const BulkUploadManager: React.FC = () => {
  const { startBulkUpload, getBulkUploadJobs, bulkUploadJobs } = useContentLibrary();
  const { CAMEROONIAN_CLASS_MAPPING, getSubjects } = useCameroonianEducation();
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadMetadata, setUploadMetadata] = useState({
    level: '1' as any,
    system: 'anglophone' as any,
    subject: '',
    type: 'textbook' as any,
    tags: [] as string[],
    isPublic: false
  });
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(prev => [...prev, ...fileArray]);
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleBulkUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    try {
      await startBulkUpload(selectedFiles, uploadMetadata);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Bulk upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (fileType.includes('word')) return <FileText className="w-5 h-5 text-blue-500" />;
    if (fileType.includes('image')) return <FileText className="w-5 h-5 text-green-500" />;
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <div className="text-lg font-medium text-gray-900 mb-2">
          Drop files here or click to select
        </div>
        <div className="text-sm text-gray-500 mb-4">
          Support for PDF, DOC, DOCX, PPT, PPTX, images, and more
        </div>
        <input
          type="file"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
        >
          Select Files
        </label>
      </div>

      {/* Upload Metadata */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School System
            </label>
            <select
              value={uploadMetadata.system}
              onChange={(e) => setUploadMetadata(prev => ({ ...prev, system: e.target.value as any }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              aria-label="Select school system"
            >
              <option value="anglophone">Anglophone</option>
              <option value="francophone">Francophone</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class Level
            </label>
            <select
              value={uploadMetadata.level}
              onChange={(e) => setUploadMetadata(prev => ({ ...prev, level: e.target.value as any }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              aria-label="Select class level"
            >
              {Object.entries(CAMEROONIAN_CLASS_MAPPING[uploadMetadata.system as SchoolSystem]).map(([level, name]) => (
                <option key={level} value={level}>{name as string}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <select
              value={uploadMetadata.subject}
              onChange={(e) => setUploadMetadata(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              aria-label="Select subject"
            >
              <option value="">Select Subject</option>
              {getSubjects(uploadMetadata.level, uploadMetadata.system).map((subject) => (
                <option key={subject.code} value={subject.name}>{subject.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Type
            </label>
            <select
              value={uploadMetadata.type}
              onChange={(e) => setUploadMetadata(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              aria-label="Select content type"
            >
              <option value="textbook">Textbook</option>
              <option value="quiz_bank">Quiz Bank</option>
              <option value="lesson_plan">Lesson Plan</option>
              <option value="worksheet">Worksheet</option>
              <option value="assessment_rubric">Assessment Rubric</option>
              <option value="teaching_guide">Teaching Guide</option>
              <option value="multimedia_resource">Multimedia Resource</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={uploadMetadata.tags.join(', ')}
              onChange={(e) => setUploadMetadata(prev => ({ 
                ...prev, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., mathematics, algebra, grade-5"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={uploadMetadata.isPublic}
              onChange={(e) => setUploadMetadata(prev => ({ ...prev, isPublic: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
              Make content public
            </label>
          </div>
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Selected Files ({selectedFiles.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <div className="font-medium text-gray-900">{file.name}</div>
                    <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleBulkUpload}
              disabled={isUploading || !uploadMetadata.subject}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} Files`}
            </button>
          </div>
        </div>
      )}

      {/* Upload Jobs */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Jobs</h3>
        <div className="space-y-4">
          {bulkUploadJobs.map((job: any) => (
            <div key={job.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {job.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {job.status === 'failed' && <XCircle className="w-5 h-5 text-red-500" />}
                  {job.status === 'processing' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                  <span className="font-medium text-gray-900">Job #{job.id.slice(-8)}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  job.status === 'completed' ? 'bg-green-100 text-green-800' :
                  job.status === 'failed' ? 'bg-red-100 text-red-800' :
                  job.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {job.status}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                {job.processedFiles} of {job.totalFiles} files processed
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(job.processedFiles / job.totalFiles) * 100}%` }}
                />
              </div>
              
              <div className="text-xs text-gray-500">
                Started: {new Date(job.startedAt).toLocaleString()}
                {job.completedAt && (
                  <span> • Completed: {new Date(job.completedAt).toLocaleString()}</span>
                )}
              </div>
              
              {job.errors.length > 0 && (
                <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                  {job.errors.length} errors occurred
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};