const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const crypto = require('crypto');

class AuthService {
  // Generate JWT token
  generateToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
  }

  // Verify JWT token
  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  // Verify refresh token
  verifyRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  }

  // Login user
  async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Verify password
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      await user.update({ lastLogin: new Date() });

      // Generate tokens
      const tokens = this.generateToken(user);

      return {
        user: user.toJSON(),
        ...tokens,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      };
    } catch (error) {
      throw error;
    }
  }

  // Register new user
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const user = await User.create({
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
        role: userData.role || 'teacher',
        schoolId: userData.schoolId,
        language: userData.language || 'en',
        phone: userData.phone,
        address: userData.address,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender
      });

      // Generate tokens
      const tokens = this.generateToken(user);

      return {
        user: user.toJSON(),
        ...tokens,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      };
    } catch (error) {
      throw error;
    }
  }

  // Refresh access token
  async refreshToken(refreshToken) {
    try {
      const decoded = this.verifyRefreshToken(refreshToken);
      const user = await User.findByPk(decoded.userId);
      
      if (!user || !user.isActive) {
        throw new Error('Invalid refresh token');
      }

      const tokens = this.generateToken(user);
      return {
        user: user.toJSON(),
        ...tokens,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      };
    } catch (error) {
      throw error;
    }
  }

  // Logout user (invalidate token)
  async logout(userId) {
    // In a production app, you might want to blacklist the token
    // For now, we'll just return success
    return { success: true, message: 'Logged out successfully' };
  }

  // Request password reset
  async requestPasswordReset(email) {
    try {
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        // Don't reveal if user exists or not
        return { success: true, message: 'Password reset email sent' };
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 3600000); // 1 hour

      await user.update({
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      });

      // In production, send email with reset link
      // For now, we'll just return the token (remove in production)
      return {
        success: true,
        message: 'Password reset email sent',
        resetToken // Remove this in production
      };
    } catch (error) {
      throw error;
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const user = await User.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: {
            [require('sequelize').Op.gt]: new Date()
          }
        }
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Update password
      await user.update({
        password: newPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      });

      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findByPk(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isValidPassword = await user.validatePassword(currentPassword);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      await user.update({ password: newPassword });

      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const user = await User.findOne({
        where: { emailVerificationToken: token }
      });

      if (!user) {
        throw new Error('Invalid verification token');
      }

      await user.update({
        emailVerified: true,
        emailVerificationToken: null
      });

      return { success: true, message: 'Email verified successfully' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();




