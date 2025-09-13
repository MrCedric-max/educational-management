import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileImage, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface ExportButtonProps {
  data: any;
  filename: string;
  formats?: string[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename,
  formats = ['PDF', 'Excel'],
  className = '',
  size = 'md',
  variant = 'primary'
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
  };

  const formatIcons = {
    PDF: <FileText className="h-4 w-4" />,
    Excel: <FileSpreadsheet className="h-4 w-4" />,
    Word: <FileText className="h-4 w-4" />,
    CSV: <FileSpreadsheet className="h-4 w-4" />,
    PNG: <FileImage className="h-4 w-4" />,
    JPG: <FileImage className="h-4 w-4" />,
    SVG: <FileImage className="h-4 w-4" />
  };

  const handleExport = async (format: string) => {
    setIsExporting(true);
    setSelectedFormat(format);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real application, this would generate and download the actual file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: getMimeType(format)
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.${format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`${format} file exported successfully`);
    } catch (error) {
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      setSelectedFormat(null);
    }
  };

  const getMimeType = (format: string): string => {
    const mimeTypes: { [key: string]: string } = {
      PDF: 'application/pdf',
      Excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      Word: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      CSV: 'text/csv',
      PNG: 'image/png',
      JPG: 'image/jpeg',
      SVG: 'image/svg+xml',
      JSON: 'application/json'
    };
    return mimeTypes[format] || 'application/octet-stream';
  };

  if (formats.length === 1) {
    return (
      <button
        onClick={() => handleExport(formats[0])}
        disabled={isExporting}
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
          rounded-md font-medium transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center space-x-2
        `}
      >
        {isExporting && selectedFormat === formats[0] ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {formatIcons[formats[0] as keyof typeof formatIcons] || <Download className="h-4 w-4" />}
            <span>{isExporting ? 'Exporting...' : `Export ${formats[0]}`}</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        disabled={isExporting}
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
          rounded-md font-medium transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center space-x-2
        `}
      >
        {isExporting ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        <span>{isExporting ? 'Exporting...' : 'Export'}</span>
      </button>

      {!isExporting && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
          <div className="py-1">
            {formats.map((format) => (
              <button
                key={format}
                onClick={() => handleExport(format)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                {formatIcons[format as keyof typeof formatIcons] || <Download className="h-4 w-4" />}
                <span>Export as {format}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
