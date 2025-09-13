// Authentication routes
const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { authenticateToken } = require('../middleware/auth');


// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const result = await authService.login(email, password);
    
    res.json({
      success: true,
      data: {
        user: result.user,
        token: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: 3600 // 1 hour in seconds
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, role, schoolId, language, phone, address, dateOfBirth, gender } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and full name are required'
      });
    }

    const result = await authService.register({
      email,
      password,
      fullName,
      role,
      schoolId,
      language,
      phone,
      address,
      dateOfBirth,
      gender
    });

    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        token: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: 3600
      },
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    const result = await authService.refreshToken(refreshToken);

    res.json({
      success: true,
      data: {
        user: result.user,
        token: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: 3600
      },
      message: 'Token refreshed successfully'
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
});

// Logout endpoint
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const result = await authService.logout(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Password reset request
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const result = await authService.requestPasswordReset(email);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Password reset confirmation
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Token and new password are required'
      });
    }

    const result = await authService.resetPassword(token, newPassword);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: req.user,
    message: 'Profile retrieved successfully'
  });
});

module.exports = router;
