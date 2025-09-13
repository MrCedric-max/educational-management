#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🏗️  Building Educational Management System for production...\n');

// Build configuration
const buildConfig = {
  sourceDir: path.join(__dirname, '..'),
  buildDir: path.join(__dirname, '..', 'dist'),
  tempDir: path.join(__dirname, '..', 'temp'),
  excludeFiles: [
    'node_modules',
    '.git',
    '.env*',
    'logs',
    'uploads',
    'temp',
    'dist',
    'coverage',
    '*.log',
    '*.tmp',
    '.DS_Store',
    'Thumbs.db'
  ],
  includeFiles: [
    'server.js',
    'package.json',
    'package-lock.json',
    'config',
    'middleware',
    'models',
    'routes',
    'services',
    'utils',
    'scripts'
  ]
};

// Clean build directory
function cleanBuildDir() {
  console.log('🧹 Cleaning build directory...');
  
  if (fs.existsSync(buildConfig.buildDir)) {
    fs.rmSync(buildConfig.buildDir, { recursive: true, force: true });
  }
  
  fs.mkdirSync(buildConfig.buildDir, { recursive: true });
  console.log('✅ Build directory cleaned');
}

// Copy files to build directory
function copyFiles() {
  console.log('📁 Copying files to build directory...');
  
  function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    
    if (stats.isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      
      const files = fs.readdirSync(src);
      files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        
        // Skip excluded files
        if (buildConfig.excludeFiles.some(pattern => {
          if (pattern.includes('*')) {
            const regex = new RegExp(pattern.replace(/\*/g, '.*'));
            return regex.test(file);
          }
          return file === pattern;
        })) {
          return;
        }
        
        copyRecursive(srcPath, destPath);
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  }
  
  // Copy only included files
  buildConfig.includeFiles.forEach(file => {
    const srcPath = path.join(buildConfig.sourceDir, file);
    const destPath = path.join(buildConfig.buildDir, file);
    
    if (fs.existsSync(srcPath)) {
      copyRecursive(srcPath, destPath);
    }
  });
  
  console.log('✅ Files copied successfully');
}

// Create production package.json
function createProductionPackageJson() {
  console.log('📦 Creating production package.json...');
  
  const packageJsonPath = path.join(buildConfig.sourceDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Remove dev dependencies
  delete packageJson.devDependencies;
  
  // Update scripts for production
  packageJson.scripts = {
    start: 'node server.js',
    'start:prod': 'NODE_ENV=production node server.js',
    'health': 'curl -f http://localhost:3001/health || exit 1'
  };
  
  // Add production-specific fields
  packageJson.main = 'server.js';
  packageJson.engines = {
    node: '>=16.0.0',
    npm: '>=8.0.0'
  };
  
  const prodPackageJsonPath = path.join(buildConfig.buildDir, 'package.json');
  fs.writeFileSync(prodPackageJsonPath, JSON.stringify(packageJson, null, 2));
  
  console.log('✅ Production package.json created');
}

// Create production environment file
function createProductionEnv() {
  console.log('⚙️  Creating production environment file...');
  
  const envContent = `# Production Environment
NODE_ENV=production
PORT=3001

# Database Configuration
DB_HOST=\${DB_HOST}
DB_PORT=\${DB_PORT}
DB_NAME=\${DB_NAME}
DB_USER=\${DB_USER}
DB_PASSWORD=\${DB_PASSWORD}

# JWT Configuration
JWT_SECRET=\${JWT_SECRET}
JWT_REFRESH_SECRET=\${JWT_REFRESH_SECRET}

# CORS Configuration
FRONTEND_URL=\${FRONTEND_URL}
ALLOWED_ORIGINS=\${ALLOWED_ORIGINS}

# File Upload
MAX_FILE_SIZE=\${MAX_FILE_SIZE}
UPLOAD_PATH=\${UPLOAD_PATH}

# Logging
LOG_LEVEL=\${LOG_LEVEL}
LOG_FILE=\${LOG_FILE}
`;

  const envPath = path.join(buildConfig.buildDir, '.env.production');
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Production environment file created');
}

// Create Dockerfile
function createDockerfile() {
  console.log('🐳 Creating Dockerfile...');
  
  const dockerfileContent = `# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nodejs -u 1001

# Create necessary directories
RUN mkdir -p logs uploads && \\
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application
CMD ["npm", "start"]
`;

  const dockerfilePath = path.join(buildConfig.buildDir, 'Dockerfile');
  fs.writeFileSync(dockerfilePath, dockerfileContent);
  
  console.log('✅ Dockerfile created');
}

// Create docker-compose.yml
function createDockerCompose() {
  console.log('🐳 Creating docker-compose.yml...');
  
  const dockerComposeContent = `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=educational_management
      - DB_USER=postgres
      - DB_PASSWORD=your_secure_password
      - JWT_SECRET=your_jwt_secret
      - JWT_REFRESH_SECRET=your_refresh_secret
      - FRONTEND_URL=http://localhost:3000
    depends_on:
      - postgres
      - redis
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=educational_management
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
`;

  const dockerComposePath = path.join(buildConfig.buildDir, 'docker-compose.yml');
  fs.writeFileSync(dockerComposePath, dockerComposeContent);
  
  console.log('✅ docker-compose.yml created');
}

// Create deployment scripts
function createDeploymentScripts() {
  console.log('📜 Creating deployment scripts...');
  
  // Start script
  const startScript = `#!/bin/bash
echo "🚀 Starting Educational Management System..."

# Load environment variables
if [ -f .env.production ]; then
  export \$(cat .env.production | grep -v '^#' | xargs)
fi

# Start the application
npm start
`;

  const startScriptPath = path.join(buildConfig.buildDir, 'start.sh');
  fs.writeFileSync(startScriptPath, startScript);
  fs.chmodSync(startScriptPath, '755');
  
  // Stop script
  const stopScript = `#!/bin/bash
echo "🛑 Stopping Educational Management System..."

# Find and kill the process
PID=\$(ps aux | grep 'node server.js' | grep -v grep | awk '{print \$2}')
if [ ! -z "\$PID" ]; then
  kill \$PID
  echo "✅ Process stopped"
else
  echo "⚠️  No running process found"
fi
`;

  const stopScriptPath = path.join(buildConfig.buildDir, 'stop.sh');
  fs.writeFileSync(stopScriptPath, stopScript);
  fs.chmodSync(stopScriptPath, '755');
  
  // Health check script
  const healthScript = `#!/bin/bash
echo "🏥 Checking system health..."

# Check if server is running
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
  echo "✅ Server is healthy"
  exit 0
else
  echo "❌ Server is not responding"
  exit 1
fi
`;

  const healthScriptPath = path.join(buildConfig.buildDir, 'health-check.sh');
  fs.writeFileSync(healthScriptPath, healthScript);
  fs.chmodSync(healthScriptPath, '755');
  
  console.log('✅ Deployment scripts created');
}

// Create README for production
function createProductionReadme() {
  console.log('📖 Creating production README...');
  
  const readmeContent = `# Educational Management System - Production

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure environment:**
   \`\`\`bash
   cp .env.production .env
   # Edit .env with your production values
   \`\`\`

3. **Start the application:**
   \`\`\`bash
   ./start.sh
   \`\`\`

## Docker Deployment

1. **Using Docker Compose:**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

2. **Using Docker:**
   \`\`\`bash
   docker build -t educational-management .
   docker run -p 3001:3001 educational-management
   \`\`\`

## Health Checks

- **Basic health:** \`curl http://localhost:3001/health\`
- **Detailed health:** \`curl http://localhost:3001/health/detailed\`
- **Metrics:** \`curl http://localhost:3001/health/metrics\`

## Monitoring

The application includes built-in monitoring:
- Request metrics
- Error tracking
- Performance monitoring
- System resource usage

## Environment Variables

See \`.env.production\` for all available configuration options.

## Logs

Logs are written to the \`logs/\` directory and rotated automatically.

## Security

- JWT authentication
- Rate limiting
- Input validation
- CORS protection
- Security headers
- Request sanitization
`;

  const readmePath = path.join(buildConfig.buildDir, 'README.md');
  fs.writeFileSync(readmePath, readmeContent);
  
  console.log('✅ Production README created');
}

// Main build function
async function build() {
  try {
    cleanBuildDir();
    copyFiles();
    createProductionPackageJson();
    createProductionEnv();
    createDockerfile();
    createDockerCompose();
    createDeploymentScripts();
    createProductionReadme();
    
    console.log('\n🎉 Build completed successfully!');
    console.log(`📁 Build output: ${buildConfig.buildDir}`);
    console.log('\n📋 Next steps:');
    console.log('1. Copy the dist/ folder to your production server');
    console.log('2. Configure your environment variables');
    console.log('3. Run: npm install && ./start.sh');
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Run build if called directly
if (require.main === module) {
  build();
}

module.exports = build;




