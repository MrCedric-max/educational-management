const os = require('os');
const process = require('process');

class MetricsCollector {
  constructor() {
    this.startTime = Date.now();
    this.requestCount = 0;
    this.errorCount = 0;
    this.responseTimes = [];
    this.activeConnections = 0;
    this.maxResponseTime = 0;
    this.minResponseTime = Infinity;
  }

  // Increment request counter
  incrementRequest() {
    this.requestCount++;
  }

  // Increment error counter
  incrementError() {
    this.errorCount++;
  }

  // Record response time
  recordResponseTime(responseTime) {
    this.responseTimes.push(responseTime);
    this.maxResponseTime = Math.max(this.maxResponseTime, responseTime);
    this.minResponseTime = Math.min(this.minResponseTime, responseTime);
    
    // Keep only last 1000 response times
    if (this.responseTimes.length > 1000) {
      this.responseTimes = this.responseTimes.slice(-1000);
    }
  }

  // Update active connections
  updateActiveConnections(count) {
    this.activeConnections = count;
  }

  // Get system metrics
  getSystemMetrics() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024), // MB
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        external: Math.round(memUsage.external / 1024 / 1024), // MB
        system: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024) // MB
      },
      cpu: {
        user: Math.round(cpuUsage.user / 1000), // ms
        system: Math.round(cpuUsage.system / 1000), // ms
        loadAverage: os.loadavg()
      },
      platform: {
        type: os.type(),
        platform: os.platform(),
        arch: os.arch(),
        release: os.release()
      }
    };
  }

  // Get application metrics
  getApplicationMetrics() {
    const avgResponseTime = this.responseTimes.length > 0 
      ? Math.round(this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length)
      : 0;

    return {
      requests: {
        total: this.requestCount,
        errors: this.errorCount,
        success: this.requestCount - this.errorCount,
        errorRate: this.requestCount > 0 ? Math.round((this.errorCount / this.requestCount) * 100) : 0
      },
      responseTime: {
        average: avgResponseTime,
        min: this.minResponseTime === Infinity ? 0 : this.minResponseTime,
        max: this.maxResponseTime,
        p95: this.getPercentile(95),
        p99: this.getPercentile(99)
      },
      connections: {
        active: this.activeConnections
      }
    };
  }

  // Get percentile value
  getPercentile(percentile) {
    if (this.responseTimes.length === 0) return 0;
    
    const sorted = [...this.responseTimes].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index] || 0;
  }

  // Get all metrics
  getAllMetrics() {
    return {
      timestamp: new Date().toISOString(),
      system: this.getSystemMetrics(),
      application: this.getApplicationMetrics()
    };
  }

  // Reset metrics
  reset() {
    this.requestCount = 0;
    this.errorCount = 0;
    this.responseTimes = [];
    this.maxResponseTime = 0;
    this.minResponseTime = Infinity;
  }
}

// Create singleton instance
const metrics = new MetricsCollector();

module.exports = metrics;