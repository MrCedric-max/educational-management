import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { UserRole } from '@prisma/client';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    schoolId: string | null;
    classId: string | null;
    isActive: boolean;
    passwordHash: string;
    temporaryPassword: string | null;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user || !user.isActive) {
      res.status(403).json({ error: 'User not found or inactive' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};
