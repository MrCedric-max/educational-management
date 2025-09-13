import React, { useState } from 'react';
import { Download, FileText, BarChart3, Users, Calendar, Settings, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReportData {
  id: string;
  type: 'monthly' | 'attendance' | 'behavior' | 'academic' | 'custom';
  title: string;
  description: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  data: any;
  charts?: boolean;
  summary?: boolean;
}

interface ReportExporterProps {
  reports: ReportData[];
  onExport?: (format: string, selectedReports: ReportData[], options: ExportOptions) => void;
}

interface ExportOptions {
  includeCharts: boolean;
  includeSummary: boolean;
  includeDetails: boolean;
  includeImages: boolean;
  pageOrientation: 'portrait' | 'landscape';
  fontSize: 'small' | 'medium' | 'large';
}

const ReportExporter: React.FC<ReportExporterProps> = ({
  reports,
  onExport
}) => {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<string>('PDF');
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeCharts: true,
    includeSummary: true,
    includeDetails: true,
    includeImages: false,
    pageOrientation: 'portrait',
    fontSize: 'medium'
  });
  const [isExporting, setIsExporting] = useState(false);

  const formats = [
    { id: 'PDF', name: 'PDF Document', icon: <FileText className="h-5 w-5" /> },
    { id: 'Excel', name: 'Excel Spreadsheet', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'Word', name: 'Word Document', icon: <FileText className="h-5 w-5" /> },
    { id: 'CSV', name: 'CSV Data', icon: <BarChart3 className="h-5 w-5" /> }
  ];

  const reportTypes = {
    monthly: { name: 'Monthly Reports', icon: <Calendar className="h-4 w-4" />, color: 'text-blue-600' },
    attendance: { name: 'Attendance Reports', icon: <Users className="h-4 w-4" />, color: 'text-green-600' },
    behavior: { name: 'Behavior Reports', icon: <Users className="h-4 w-4" />, color: 'text-yellow-600' },
    academic: { name: 'Academic Reports', icon: <BarChart3 className="h-4 w-4" />, color: 'text-purple-600' },
    custom: { name: 'Custom Reports', icon: <Settings className="h-4 w-4" />, color: 'text-gray-600' }
  };

  const handleSelectAll = () => {
    if (selectedReports.length === reports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(reports.map(report => report.id));
    }
  };

  const handleSelectReport = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleExport = async () => {
    if (selectedReports.length === 0) {
      toast.error('Please select at least one report to export');
      return;
    }

    setIsExporting(true);

    try {
      const selectedReportData = reports.filter(report => selectedReports.includes(report.id));
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (onExport) {
        onExport(exportFormat, selectedReportData, exportOptions);
      }

      toast.success(`${selectedReports.length} report(s) exported as ${exportFormat}`);
    } catch (error) {
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const updateExportOption = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generatePreview = () => {
    const selectedReportData = reports.filter(report => selectedReports.includes(report.id));
    
    if (selectedReportData.length === 0) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
        <h4 className="font-semibold text-gray-900 mb-3">Export Preview</h4>
        <div className="space-y-3">
          {selectedReportData.map((report) => {
            const typeInfo = reportTypes[report.type];
            return (
              <div key={report.id} className="bg-white rounded p-3 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={typeInfo.color}>
                      {typeInfo.icon}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{report.title}</h5>
                      <p className="text-sm text-gray-600">
                        {report.dateRange.start.toLocaleDateString()} - {report.dateRange.end.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {report.charts ? 'With Charts' : 'Data Only'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Export Reports</h3>
          <p className="text-sm text-gray-600">Select reports and configure export options</p>
        </div>
        <FileText className="h-8 w-8 text-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Selection */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Select Reports</h4>
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {selectedReports.length === reports.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
            {reports.map((report) => {
              const typeInfo = reportTypes[report.type];
              return (
                <label key={report.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={selectedReports.includes(report.id)}
                    onChange={() => handleSelectReport(report.id)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={typeInfo.color}>
                        {typeInfo.icon}
                      </div>
                      <div className="font-medium text-gray-900">{report.title}</div>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{report.description}</div>
                    <div className="text-xs text-gray-500">
                      {report.dateRange.start.toLocaleDateString()} - {report.dateRange.end.toLocaleDateString()}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          {selectedReports.length > 0 && (
            <div className="mt-3 text-sm text-gray-600">
              {selectedReports.length} of {reports.length} reports selected
            </div>
          )}
        </div>

        {/* Export Configuration */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Export Configuration</h4>
          
          {/* Format Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="space-y-2">
              {formats.map((format) => (
                <label key={format.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="format"
                    value={format.id}
                    checked={exportFormat === format.id}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    {format.icon}
                    <span className="text-sm font-medium text-gray-900">{format.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Content Options */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Include Content
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={exportOptions.includeCharts}
                  onChange={(e) => updateExportOption('includeCharts', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Charts & Graphs</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={exportOptions.includeSummary}
                  onChange={(e) => updateExportOption('includeSummary', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Executive Summary</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={exportOptions.includeDetails}
                  onChange={(e) => updateExportOption('includeDetails', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Detailed Data</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={exportOptions.includeImages}
                  onChange={(e) => updateExportOption('includeImages', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Images & Photos</span>
              </label>
            </div>
          </div>

          {/* Layout Options */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Layout Options
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Page Orientation</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateExportOption('pageOrientation', 'portrait')}
                    className={`px-3 py-1 text-sm rounded ${
                      exportOptions.pageOrientation === 'portrait'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    onClick={() => updateExportOption('pageOrientation', 'landscape')}
                    className={`px-3 py-1 text-sm rounded ${
                      exportOptions.pageOrientation === 'landscape'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Font Size</label>
                <select
                  value={exportOptions.fontSize}
                  onChange={(e) => updateExportOption('fontSize', e.target.value)}
                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      {selectedReports.length > 0 && (
        <div className="mt-6">
          {generatePreview()}
        </div>
      )}

      {/* Export Button */}
      <div className="mt-6 pt-4 border-t">
        <button
          onClick={handleExport}
          disabled={selectedReports.length === 0 || isExporting}
          className="w-full px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              <span>Export {selectedReports.length} Report(s)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReportExporter;
