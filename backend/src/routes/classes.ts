import express from 'express';
import { 
  getClasses, 
  getClassById, 
  createClass, 
  updateClass, 
  deleteClass,
  getClassStudents
} from '../controllers/classController';
import { authenticateToken } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = express.Router();

// Class management routes
router.get('/', authenticateToken, getClasses);
router.get('/:id', authenticateToken, getClassById);
router.get('/:id/students', authenticateToken, getClassStudents);
router.post('/', authenticateToken, authorize(['SUPER_ADMIN', 'SCHOOL_ADMIN']), createClass);
router.put('/:id', authenticateToken, authorize(['SUPER_ADMIN', 'SCHOOL_ADMIN']), updateClass);
router.delete('/:id', authenticateToken, authorize(['SUPER_ADMIN', 'SCHOOL_ADMIN']), deleteClass);

export default router;













