const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.logFile = process.env.LOG_FILE || './logs/app.log';
    this.maxSize = parseInt(process.env.LOG_MAX_SIZE) || 10 * 1024 * 1024; // 10MB
    this.maxFiles = parseInt(process.env.LOG_MAX_FILES) || 5;
    
    // Create logs directory if it doesn't exist
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    // Log levels
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
  }

  shouldLog(level) {
    return this.levels[level] <= this.levels[this.logLevel];
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
  }

  writeToFile(message) {
    try {
      fs.appendFileSync(this.logFile, message + '\n');
      
      // Check if log rotation is needed
      this.rotateLogIfNeeded();
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  rotateLogIfNeeded() {
    try {
      const stats = fs.statSync(this.logFile);
      
      if (stats.size > this.maxSize) {
        // Rotate logs
        for (let i = this.maxFiles - 1; i > 0; i--) {
          const oldFile = `${this.logFile}.${i}`;
          const newFile = `${this.logFile}.${i + 1}`;
          
          if (fs.existsSync(oldFile)) {
            if (i === this.maxFiles - 1) {
              fs.unlinkSync(oldFile); // Delete oldest log
            } else {
              fs.renameSync(oldFile, newFile);
            }
          }
        }
        
        // Move current log to .1
        fs.renameSync(this.logFile, `${this.logFile}.1`);
      }
    } catch (error) {
      console.error('Failed to rotate log file:', error.message);
    }
  }

  log(level, message, meta = {}) {
    if (!this.shouldLog(level)) {
      return;
    }

    const formattedMessage = this.formatMessage(level, message, meta);
    
    // Console output
    const colors = {
      error: '\x1b[31m', // Red
      warn: '\x1b[33m',  // Yellow
      info: '\x1b[36m',  // Cyan
      debug: '\x1b[37m'  // White
    };
    
    const resetColor = '\x1b[0m';
    console.log(`${colors[level] || ''}${formattedMessage}${resetColor}`);
    
    // File output
    this.writeToFile(formattedMessage);
  }

  error(message, meta = {}) {
    this.log('error', message, meta);
  }

  warn(message, meta = {}) {
    this.log('warn', message, meta);
  }

  info(message, meta = {}) {
    this.log('info', message, meta);
  }

  debug(message, meta = {}) {
    this.log('debug', message, meta);
  }

  // Request logging
  logRequest(req, res, responseTime) {
    const meta = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id
    };

    if (res.statusCode >= 400) {
      this.error('Request failed', meta);
    } else {
      this.info('Request completed', meta);
    }
  }

  // Error logging with stack trace
  logError(error, req = null) {
    const meta = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...(req && {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id
      })
    };

    this.error('Application error', meta);
  }

  // Database query logging
  logQuery(query, duration, params = []) {
    this.debug('Database query', {
      query: query.substring(0, 200) + (query.length > 200 ? '...' : ''),
      duration: `${duration}ms`,
      params: params.length > 0 ? params : undefined
    });
  }

  // Authentication logging
  logAuth(action, userId, success, ip = null) {
    const meta = {
      action,
      userId,
      success,
      ip
    };

    if (success) {
      this.info('Authentication success', meta);
    } else {
      this.warn('Authentication failed', meta);
    }
  }

  // Security event logging
  logSecurity(event, details = {}) {
    this.warn('Security event', {
      event,
      ...details,
      timestamp: new Date().toISOString()
    });
  }
}

// Create singleton instance
const logger = new Logger();

module.exports = logger;




