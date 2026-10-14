import express from 'express';
import { 
  getCurriculum, 
  getSubjects, 
  getLearningThemes,
  searchCurriculum,
  getCompetenceActivities,
  getProjectSuggestions,
  getAfricanExamples
} from '../controllers/curriculumController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Curriculum routes
router.get('/:system/:level', authenticateToken, getCurriculum);
router.get('/subjects/:system/:level', authenticateToken, getSubjects);
router.get('/themes/:system/:level', authenticateToken, getLearningThemes);
router.get('/search', authenticateToken, searchCurriculum);
router.get('/competence/:system/:level/:subject', authenticateToken, getCompetenceActivities);
router.get('/projects/:system/:level/:subject', authenticateToken, getProjectSuggestions);
router.get('/african-examples/:system/:level/:subject', authenticateToken, getAfricanExamples);

export default router;













