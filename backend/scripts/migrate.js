const { sequelize, testConnection } = require('../config/database');
const models = require('../models');

async function migrate() {
  try {
    console.log('🔄 Starting database migration...');
    
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Database connection failed. Please check your database configuration.');
      process.exit(1);
    }

    // Sync all models with database
    console.log('📊 Syncing database models...');
    await sequelize.sync({ force: false, alter: true });
    
    console.log('✅ Database migration completed successfully!');
    
    // Close database connection
    await sequelize.close();
    console.log('🔌 Database connection closed.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrate();
}

module.exports = migrate;




