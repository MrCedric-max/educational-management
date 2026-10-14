import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../index';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        school: true,
        class: true
      }
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const payload = { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      schoolId: user.schoolId,
      classId: user.classId
    };
    
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const options: jwt.SignOptions = { expiresIn: '7d' };
    
    const token = jwt.sign(payload, secret, options);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        classId: user.classId,
        school: user.school,
        class: user.class
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role, schoolId, classId, fullName } = req.body;

    // Validate input
    if (!email || !password || !role || !fullName) {
      res.status(400).json({ error: 'Email, password, role, and fullName are required' });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '10');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        fullName,
        role,
        schoolId: schoolId || null,
        classId: classId || null
      }
    });

    // Generate JWT token
    const payload = { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      schoolId: user.schoolId,
      classId: user.classId
    };
    
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const options: jwt.SignOptions = { expiresIn: '7d' };
    
    const token = jwt.sign(payload, secret, options);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        classId: user.classId
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return success
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token is required' });
      return;
    }

    // Verify refresh token
    const secret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
    const decoded = jwt.verify(refreshToken, secret) as any;
    
    // Generate new access token
    const payload = { 
      id: decoded.id, 
      email: decoded.email, 
      role: decoded.role,
      schoolId: decoded.schoolId,
      classId: decoded.classId
    };
    
    const accessSecret = process.env.JWT_SECRET || 'fallback-secret';
    const options: jwt.SignOptions = { expiresIn: '7d' };
    
    const token = jwt.sign(payload, accessSecret, options);

    res.json({
      success: true,
      token
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};