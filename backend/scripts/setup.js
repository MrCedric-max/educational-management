// Backend setup script
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Educational Management Backend...');

// Create necessary directories
const directories = [
  'routes',
  'models',
  'middleware',
  'controllers',
  'utils',
  'config',
  'logs'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Create basic route files
const routeFiles = [
  'users.js',
  'schools.js',
  'classes.js',
  'students.js',
  'quizzes.js',
  'notifications.js',
  'dashboard.js',
  'files.js'
];

routeFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', 'routes', file);
  if (!fs.existsSync(filePath)) {
    const content = `// ${file.replace('.js', '')} routes
const express = require('express');
const router = express.Router();

// GET /api/${file.replace('.js', '')}
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: '${file.replace('.js', '')} endpoint working',
    data: []
  });
});

module.exports = router;`;
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created route file: ${file}`);
  }
});

// Create environment file
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  const envContent = `# Educational Management System Backend Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=educational_management
DB_USER=postgres
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h

# WebSocket Configuration
WS_URL=ws://localhost:3001/ws

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,jpeg,png,gif,mp4,mp3

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
}

// Create basic middleware
const middlewarePath = path.join(__dirname, '..', 'middleware', 'auth.js');
if (!fs.existsSync(middlewarePath)) {
  const authMiddleware = `// Authentication middleware
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };`;
  
  fs.writeFileSync(middlewarePath, authMiddleware);
  console.log('✅ Created auth middleware');
}

console.log('🎉 Backend setup completed successfully!');
console.log('');
console.log('Next steps:');
console.log('1. Run: npm install');
console.log('2. Start the server: npm run dev');
console.log('3. The API will be available at: http://localhost:3001');
console.log('4. WebSocket will be available at: ws://localhost:3001/ws');




