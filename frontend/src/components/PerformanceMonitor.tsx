import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Zap,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings,
  BarChart3,
  Monitor,
  Server,
  Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface PerformanceMetrics {
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  cacheHitRate: number;
  databaseQueries: number;
  networkLatency: number;
  pageLoadTime: number;
  bundleSize: number;
  activeConnections: number;
  errorRate: number;
}

interface CacheStats {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  hitRate: number;
  memoryUsed: string;
  entries: number;
  lastCleared: string;
}

interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'performance' | 'memory' | 'network' | 'database';
  status: 'pending' | 'applied' | 'dismissed';
  estimatedImprovement: string;
}

const PerformanceMonitor: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    responseTime: 245,
    memoryUsage: 68.5,
    cpuUsage: 23.4,
    cacheHitRate: 87.2,
    databaseQueries: 1247,
    networkLatency: 45,
    pageLoadTime: 1.2,
    bundleSize: 2.4,
    activeConnections: 156,
    errorRate: 0.2
  });

  const [cacheStats, setCacheStats] = useState<CacheStats>({
    totalRequests: 15420,
    cacheHits: 13446,
    cacheMisses: 1974,
    hitRate: 87.2,
    memoryUsed: '45.2 MB',
    entries: 1247,
    lastCleared: '2 hours ago'
  });

  const [optimizationSuggestions] = useState<OptimizationSuggestion[]>([
    {
      id: '1',
      title: 'Enable Code Splitting',
      description: 'Implement dynamic imports to reduce initial bundle size',
      impact: 'high',
      category: 'performance',
      status: 'pending',
      estimatedImprovement: '30% faster page load'
    },
    {
      id: '2',
      title: 'Implement Service Worker Caching',
      description: 'Add service worker for offline functionality and faster loading',
      impact: 'high',
      category: 'performance',
      status: 'pending',
      estimatedImprovement: '50% faster repeat visits'
    },
    {
      id: '3',
      title: 'Optimize Database Queries',
      description: 'Add indexes and optimize slow queries',
      impact: 'medium',
      category: 'database',
      status: 'pending',
      estimatedImprovement: '25% faster data loading'
    },
    {
      id: '4',
      title: 'Enable Gzip Compression',
      description: 'Compress static assets to reduce transfer size',
      impact: 'medium',
      category: 'network',
      status: 'applied',
      estimatedImprovement: '40% smaller file sizes'
    },
    {
      id: '5',
      title: 'Implement Image Optimization',
      description: 'Use WebP format and responsive images',
      impact: 'medium',
      category: 'performance',
      status: 'pending',
      estimatedImprovement: '35% smaller images'
    }
  ]);

  const [isMonitoring, setIsMonitoring] = useState(true);

  // Simulate real-time performance monitoring
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        responseTime: Math.max(100, prev.responseTime + (Math.random() - 0.5) * 50),
        memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        cpuUsage: Math.max(0, Math.min(100, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        cacheHitRate: Math.max(0, Math.min(100, prev.cacheHitRate + (Math.random() - 0.5) * 2)),
        databaseQueries: prev.databaseQueries + Math.floor(Math.random() * 10),
        networkLatency: Math.max(10, prev.networkLatency + (Math.random() - 0.5) * 20),
        pageLoadTime: Math.max(0.5, prev.pageLoadTime + (Math.random() - 0.5) * 0.3),
        bundleSize: prev.bundleSize,
        activeConnections: prev.activeConnections + Math.floor((Math.random() - 0.5) * 5),
        errorRate: Math.max(0, Math.min(5, prev.errorRate + (Math.random() - 0.5) * 0.5))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getPerformanceStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.warning) return 'warning';
    return 'critical';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return Zap;
      case 'memory': return HardDrive;
      case 'network': return Wifi;
      case 'database': return Database;
      default: return Settings;
    }
  };

  const performanceScore = useMemo(() => {
    const responseScore = Math.max(0, 100 - (metrics.responseTime - 100) / 2);
    const memoryScore = Math.max(0, 100 - metrics.memoryUsage);
    const cpuScore = Math.max(0, 100 - metrics.cpuUsage);
    const cacheScore = metrics.cacheHitRate;
    const errorScore = Math.max(0, 100 - metrics.errorRate * 20);
    
    return Math.round((responseScore + memoryScore + cpuScore + cacheScore + errorScore) / 5);
  }, [metrics]);

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    unit?: string;
    status: 'good' | 'warning' | 'critical';
    icon: React.ComponentType<any>;
    trend?: 'up' | 'down' | 'stable';
  }> = ({ title, value, unit = '', status, icon: Icon, trend }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {value}{unit}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`p-3 rounded-lg ${getStatusColor(status)}`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className={`text-sm ${
              trend === 'up' ? 'text-green-600' :
              trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              <TrendingUp className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Performance Monitor
              </h1>
              <p className="text-gray-600">
                Real-time performance metrics and optimization insights
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                  isMonitoring
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                <Activity className={`w-4 h-4 mr-2 ${isMonitoring ? 'animate-pulse' : ''}`} />
                {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
              </button>
              <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Performance Score */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Overall Performance Score</h2>
              <div className="flex items-center">
                <div className="text-4xl font-bold text-gray-900 mr-4">{performanceScore}</div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        performanceScore >= 90 ? 'bg-green-500' :
                        performanceScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${performanceScore}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {performanceScore >= 90 ? 'Excellent' :
                     performanceScore >= 70 ? 'Good' : 'Needs Improvement'}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Response Time"
            value={Math.round(metrics.responseTime)}
            unit="ms"
            status={getPerformanceStatus(metrics.responseTime, { good: 200, warning: 500 })}
            icon={Clock}
          />
          <MetricCard
            title="Memory Usage"
            value={metrics.memoryUsage.toFixed(1)}
            unit="%"
            status={getPerformanceStatus(metrics.memoryUsage, { good: 60, warning: 80 })}
            icon={HardDrive}
          />
          <MetricCard
            title="CPU Usage"
            value={metrics.cpuUsage.toFixed(1)}
            unit="%"
            status={getPerformanceStatus(metrics.cpuUsage, { good: 50, warning: 80 })}
            icon={Cpu}
          />
          <MetricCard
            title="Cache Hit Rate"
            value={metrics.cacheHitRate.toFixed(1)}
            unit="%"
            status={getPerformanceStatus(100 - metrics.cacheHitRate, { good: 10, warning: 20 })}
            icon={Database}
          />
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Page Load Time"
            value={metrics.pageLoadTime.toFixed(1)}
            unit="s"
            status={getPerformanceStatus(metrics.pageLoadTime * 1000, { good: 1000, warning: 3000 })}
            icon={Monitor}
          />
          <MetricCard
            title="Network Latency"
            value={metrics.networkLatency}
            unit="ms"
            status={getPerformanceStatus(metrics.networkLatency, { good: 50, warning: 100 })}
            icon={Wifi}
          />
          <MetricCard
            title="Error Rate"
            value={metrics.errorRate.toFixed(2)}
            unit="%"
            status={getPerformanceStatus(metrics.errorRate, { good: 1, warning: 3 })}
            icon={AlertTriangle}
          />
        </div>

        {/* Cache Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cache Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-bold text-gray-900">{cacheStats.hitRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Cache Hit Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{cacheStats.entries.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Cache Entries</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{cacheStats.memoryUsed}</div>
              <div className="text-sm text-gray-600">Memory Used</div>
            </div>
          </div>
        </div>

        {/* Optimization Suggestions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Suggestions</h3>
          <div className="space-y-4">
            {optimizationSuggestions.map((suggestion) => {
              const CategoryIcon = getCategoryIcon(suggestion.category);
              return (
                <div key={suggestion.id} className="flex items-start p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0 mr-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <CategoryIcon className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{suggestion.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImpactColor(suggestion.impact)}`}>
                          {suggestion.impact} impact
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          suggestion.status === 'applied' ? 'bg-green-100 text-green-800' :
                          suggestion.status === 'dismissed' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {suggestion.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Estimated improvement: {suggestion.estimatedImprovement}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {suggestion.status === 'pending' && (
                      <button className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800">
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;





