#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Load environment configuration based on NODE_ENV
 */
function loadConfig() {
  const env = process.env.NODE_ENV || 'development';
  const configFile = path.join(__dirname, '..', `env.${env}`);
  
  console.log(`🔄 Loading configuration for ${env} environment...`);
  
  if (fs.existsSync(configFile)) {
    console.log(`📁 Loading config from: ${configFile}`);
    
    // Read and parse the config file
    const configContent = fs.readFileSync(configFile, 'utf8');
    const lines = configContent.split('\n');
    
    let loadedVars = 0;
    
    lines.forEach(line => {
      line = line.trim();
      
      // Skip comments and empty lines
      if (line.startsWith('#') || line === '') {
        return;
      }
      
      // Parse KEY=VALUE format
      const equalIndex = line.indexOf('=');
      if (equalIndex > 0) {
        const key = line.substring(0, equalIndex).trim();
        const value = line.substring(equalIndex + 1).trim();
        
        // Only set if not already defined
        if (!process.env[key]) {
          process.env[key] = value;
          loadedVars++;
        }
      }
    });
    
    console.log(`✅ Loaded ${loadedVars} environment variables`);
  } else {
    console.log(`⚠️  Config file not found: ${configFile}`);
    console.log('📝 Using default environment variables');
  }
  
  // Validate required variables
  const requiredVars = [
    'NODE_ENV',
    'PORT',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
  }
  
  console.log('✅ Configuration loaded successfully');
}

// Export for use in other modules
module.exports = loadConfig;

// Run if called directly
if (require.main === module) {
  loadConfig();
}




