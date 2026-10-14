import express from 'express';
import { 
  getSchools, 
  getSchoolById, 
  createSchool, 
  updateSchool, 
  deleteSchool,
  activateSchool
} from '../controllers/schoolController';
import { authenticateToken } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = express.Router();

// School management routes
router.get('/', authenticateToken, authorize(['SUPER_ADMIN']), getSchools);
router.get('/:id', authenticateToken, getSchoolById);
router.post('/', authenticateToken, authorize(['SUPER_ADMIN']), createSchool);
router.put('/:id', authenticateToken, authorize(['SUPER_ADMIN', 'SCHOOL_ADMIN']), updateSchool);
router.delete('/:id', authenticateToken, authorize(['SUPER_ADMIN']), deleteSchool);
router.patch('/:id/activate', authenticateToken, authorize(['SUPER_ADMIN']), activateSchool);

export default router;













