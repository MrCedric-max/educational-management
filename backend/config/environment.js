require('dotenv').config();

const config = {
  // Environment
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 3001,
  
  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'educational_management',
    testName: process.env.DB_NAME_TEST || 'educational_management_test',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  
  // CORS
  cors: {
    origins: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
  },
  
  // File Upload
  upload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    path: process.env.UPLOAD_PATH || './uploads',
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  },
  
  // Email
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.FROM_EMAIL || 'noreply@educationalmanagement.com'
  },
  
  // Redis (for sessions and caching)
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB) || 0
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    authWindowMs: 15 * 60 * 1000, // 15 minutes
    authMaxRequests: 5,
    passwordResetWindowMs: 60 * 60 * 1000, // 1 hour
    passwordResetMaxRequests: 3
  },
  
  // Security
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
    passwordMinLength: 6,
    passwordMaxLength: 100
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/app.log',
    maxSize: process.env.LOG_MAX_SIZE || '10m',
    maxFiles: process.env.LOG_MAX_FILES || '5'
  },
  
  // Monitoring
  monitoring: {
    enableMetrics: process.env.ENABLE_METRICS === 'true',
    metricsPort: parseInt(process.env.METRICS_PORT) || 9090
  },
  
  // Frontend
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
    apiUrl: process.env.API_URL || 'http://localhost:3001'
  }
};

// Validation
const validateConfig = () => {
  const required = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'DB_PASSWORD'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0 && config.env === 'production') {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    process.exit(1);
  }
  
  if (config.env === 'production') {
    // Production-specific validations
    if (config.jwt.secret === 'your-super-secret-jwt-key-change-in-production') {
      console.error('❌ JWT_SECRET must be changed in production');
      process.exit(1);
    }
    
    if (config.jwt.refreshSecret === 'your-super-secret-refresh-key-change-in-production') {
      console.error('❌ JWT_REFRESH_SECRET must be changed in production');
      process.exit(1);
    }
    
    if (config.security.sessionSecret === 'your-session-secret-change-in-production') {
      console.error('❌ SESSION_SECRET must be changed in production');
      process.exit(1);
    }
  }
};

// Validate configuration on startup
validateConfig();

module.exports = config;




