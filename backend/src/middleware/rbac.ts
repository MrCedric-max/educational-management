import { Request, Response, NextFunction } from 'express';
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

export const checkSchoolAccess = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Super admin can access all schools
  if (req.user.role === 'SUPER_ADMIN') {
    return next();
  }

  // School admin and teachers can only access their school
  const schoolId = req.params.schoolId || req.body.schoolId;
  if (req.user.schoolId !== schoolId) {
    return res.status(403).json({ error: 'Access denied to this school' });
  }

  next();
};

export const checkClassAccess = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Super admin and school admin can access all classes
  if (req.user.role === 'SUPER_ADMIN' || req.user.role === 'SCHOOL_ADMIN') {
    return next();
  }

  // Teachers can only access their assigned class
  const classId = req.params.classId || req.body.classId;
  if (req.user.classId !== classId) {
    return res.status(403).json({ error: 'Access denied to this class' });
  }

  next();
};
