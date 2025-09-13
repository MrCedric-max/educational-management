#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Educational Management System Deployment Script\n');

// Deployment configuration
const deployConfig = {
  environments: {
    development: {
      name: 'Development',
      buildDir: path.join(__dirname, '..', 'dist'),
      targetDir: '/var/www/educational-management-dev',
      serviceName: 'educational-management-dev',
      port: 3001
    },
    staging: {
      name: 'Staging',
      buildDir: path.join(__dirname, '..', 'dist'),
      targetDir: '/var/www/educational-management-staging',
      serviceName: 'educational-management-staging',
      port: 3002
    },
    production: {
      name: 'Production',
      buildDir: path.join(__dirname, '..', 'dist'),
      targetDir: '/var/www/educational-management',
      serviceName: 'educational-management',
      port: 3001
    }
  }
};

// Get environment from command line arguments
const environment = process.argv[2] || 'development';
const config = deployConfig.environments[environment];

if (!config) {
  console.error('❌ Invalid environment. Available: development, staging, production');
  process.exit(1);
}

console.log(`🎯 Deploying to ${config.name} environment...\n`);

// Check if build directory exists
function checkBuildDirectory() {
  console.log('🔍 Checking build directory...');
  
  if (!fs.existsSync(config.buildDir)) {
    console.error('❌ Build directory not found. Run "npm run build" first.');
    process.exit(1);
  }
  
  console.log('✅ Build directory found');
}

// Create target directory
function createTargetDirectory() {
  console.log('📁 Creating target directory...');
  
  try {
    execSync(`sudo mkdir -p ${config.targetDir}`, { stdio: 'inherit' });
    console.log('✅ Target directory created');
  } catch (error) {
    console.error('❌ Failed to create target directory:', error.message);
    process.exit(1);
  }
}

// Copy files to target directory
function copyFiles() {
  console.log('📋 Copying files to target directory...');
  
  try {
    execSync(`sudo cp -r ${config.buildDir}/* ${config.targetDir}/`, { stdio: 'inherit' });
    execSync(`sudo chown -R www-data:www-data ${config.targetDir}`, { stdio: 'inherit' });
    console.log('✅ Files copied successfully');
  } catch (error) {
    console.error('❌ Failed to copy files:', error.message);
    process.exit(1);
  }
}

// Install dependencies
function installDependencies() {
  console.log('📦 Installing dependencies...');
  
  try {
    execSync(`cd ${config.targetDir} && npm ci --only=production`, { stdio: 'inherit' });
    console.log('✅ Dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
}

// Create systemd service
function createSystemdService() {
  console.log('⚙️  Creating systemd service...');
  
  const serviceContent = `[Unit]
Description=Educational Management System - ${config.name}
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=${config.targetDir}
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=${environment}
Environment=PORT=${config.port}

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=${config.targetDir}

# Resource limits
LimitNOFILE=65536
MemoryMax=1G

[Install]
WantedBy=multi-user.target
`;

  const servicePath = `/etc/systemd/system/${config.serviceName}.service`;
  
  try {
    fs.writeFileSync('/tmp/service.tmp', serviceContent);
    execSync(`sudo mv /tmp/service.tmp ${servicePath}`, { stdio: 'inherit' });
    execSync('sudo systemctl daemon-reload', { stdio: 'inherit' });
    console.log('✅ Systemd service created');
  } catch (error) {
    console.error('❌ Failed to create systemd service:', error.message);
    process.exit(1);
  }
}

// Start/restart service
function manageService() {
  console.log('🔄 Managing service...');
  
  try {
    // Stop service if running
    execSync(`sudo systemctl stop ${config.serviceName}`, { stdio: 'inherit' });
    
    // Start service
    execSync(`sudo systemctl start ${config.serviceName}`, { stdio: 'inherit' });
    execSync(`sudo systemctl enable ${config.serviceName}`, { stdio: 'inherit' });
    
    console.log('✅ Service started and enabled');
  } catch (error) {
    console.error('❌ Failed to manage service:', error.message);
    process.exit(1);
  }
}

// Configure Nginx (if needed)
function configureNginx() {
  console.log('🌐 Configuring Nginx...');
  
  const nginxConfig = `server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:${config.port};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:${config.port}/health;
        access_log off;
    }
}`;

  const nginxPath = `/etc/nginx/sites-available/${config.serviceName}`;
  
  try {
    fs.writeFileSync('/tmp/nginx.tmp', nginxConfig);
    execSync(`sudo mv /tmp/nginx.tmp ${nginxPath}`, { stdio: 'inherit' });
    execSync(`sudo ln -sf ${nginxPath} /etc/nginx/sites-enabled/`, { stdio: 'inherit' });
    execSync('sudo nginx -t', { stdio: 'inherit' });
    execSync('sudo systemctl reload nginx', { stdio: 'inherit' });
    
    console.log('✅ Nginx configured');
  } catch (error) {
    console.warn('⚠️  Nginx configuration failed (this is optional):', error.message);
  }
}

// Run health check
function runHealthCheck() {
  console.log('🏥 Running health check...');
  
  const maxRetries = 10;
  let retries = 0;
  
  const checkHealth = () => {
    try {
      execSync(`curl -f http://localhost:${config.port}/health`, { stdio: 'inherit' });
      console.log('✅ Health check passed');
      return true;
    } catch (error) {
      retries++;
      if (retries < maxRetries) {
        console.log(`⏳ Health check failed, retrying... (${retries}/${maxRetries})`);
        setTimeout(checkHealth, 5000);
      } else {
        console.error('❌ Health check failed after maximum retries');
        return false;
      }
    }
  };
  
  setTimeout(checkHealth, 2000);
}

// Show deployment status
function showStatus() {
  console.log('\n📊 Deployment Status:');
  console.log(`Environment: ${config.name}`);
  console.log(`Service: ${config.serviceName}`);
  console.log(`Port: ${config.port}`);
  console.log(`Target Directory: ${config.targetDir}`);
  console.log(`Health Check: http://localhost:${config.port}/health`);
  
  console.log('\n🔧 Useful Commands:');
  console.log(`sudo systemctl status ${config.serviceName}`);
  console.log(`sudo systemctl logs ${config.serviceName}`);
  console.log(`sudo systemctl restart ${config.serviceName}`);
  console.log(`sudo systemctl stop ${config.serviceName}`);
}

// Main deployment function
async function deploy() {
  try {
    checkBuildDirectory();
    createTargetDirectory();
    copyFiles();
    installDependencies();
    createSystemdService();
    manageService();
    configureNginx();
    runHealthCheck();
    showStatus();
    
    console.log('\n🎉 Deployment completed successfully!');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run deployment if called directly
if (require.main === module) {
  deploy();
}

module.exports = deploy;




