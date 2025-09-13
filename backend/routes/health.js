const express = require('express');
const router = express.Router();
const { testConnection } = require('../config/database');
const metrics = require('../utils/metrics');
const logger = require('../utils/logger');

// Basic health check
router.get('/', async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Test database connection
    const dbConnected = await testConnection();
    
    const responseTime = Date.now() - startTime;
    
    const health = {
      status: dbConnected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      database: {
        status: dbConnected ? 'connected' : 'disconnected'
      },
      version: process.env.npm_package_version || '1.0.0'
    };

    const statusCode = dbConnected ? 200 : 503;
    res.status(statusCode).json(health);
    
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

// Detailed health check
router.get('/detailed', async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Test database connection
    const dbConnected = await testConnection();
    
    const responseTime = Date.now() - startTime;
    
    const health = {
      status: dbConnected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      database: {
        status: dbConnected ? 'connected' : 'disconnected'
      },
      system: metrics.getSystemMetrics(),
      application: metrics.getApplicationMetrics(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };

    const statusCode = dbConnected ? 200 : 503;
    res.status(statusCode).json(health);
    
  } catch (error) {
    logger.error('Detailed health check failed', { error: error.message });
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Detailed health check failed'
    });
  }
});

// Readiness check (for Kubernetes)
router.get('/ready', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    
    if (dbConnected) {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'not ready',
        timestamp: new Date().toISOString(),
        reason: 'Database not connected'
      });
    }
  } catch (error) {
    logger.error('Readiness check failed', { error: error.message });
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      reason: 'Readiness check failed'
    });
  }
});

// Liveness check (for Kubernetes)
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Metrics endpoint
router.get('/metrics', (req, res) => {
  try {
    const allMetrics = metrics.getAllMetrics();
    res.json(allMetrics);
  } catch (error) {
    logger.error('Metrics retrieval failed', { error: error.message });
    res.status(500).json({
      error: 'Failed to retrieve metrics'
    });
  }
});

// Reset metrics (admin only)
router.post('/metrics/reset', (req, res) => {
  try {
    metrics.reset();
    logger.info('Metrics reset by admin');
    res.json({
      success: true,
      message: 'Metrics reset successfully'
    });
  } catch (error) {
    logger.error('Metrics reset failed', { error: error.message });
    res.status(500).json({
      error: 'Failed to reset metrics'
    });
  }
});

module.exports = router;




