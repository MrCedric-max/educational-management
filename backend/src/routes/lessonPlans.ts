import express from 'express';
import { 
  getLessonPlans, 
  getLessonPlanById, 
  createLessonPlan, 
  updateLessonPlan, 
  deleteLessonPlan,
  generateLessonPlan
} from '../controllers/lessonPlanController';
import { authenticateToken } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = express.Router();

// Lesson plan management routes
router.get('/', authenticateToken, getLessonPlans);
router.get('/:id', authenticateToken, getLessonPlanById);
router.post('/', authenticateToken, authorize(['TEACHER', 'SCHOOL_ADMIN']), createLessonPlan);
router.post('/generate', authenticateToken, authorize(['TEACHER', 'SCHOOL_ADMIN']), generateLessonPlan);
router.put('/:id', authenticateToken, authorize(['TEACHER', 'SCHOOL_ADMIN']), updateLessonPlan);
router.delete('/:id', authenticateToken, authorize(['TEACHER', 'SCHOOL_ADMIN']), deleteLessonPlan);

export default router;













