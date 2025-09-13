import express from 'express';
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser,
  importUsers,
  exportUsers
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { authorize } from '../middleware/rbac';

const router = express.Router();

// User management routes
router.get('/', authenticateToken, authorize(['SUPER_ADMIN', 'SCHOOL_ADMIN']), getUsers);
router.get('/:id', authenticateToken, getUserById);
router.post('/', authenticateToken, authorize(['SUPER_ADMIN', 'SCHOOL_ADMIN']), createUser);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, authorize(['SUPER_ADMIN', 'SCHOOL_ADMIN']), deleteUser);
router.post('/import', authenticateToken, authorize(['SUPER_ADMIN', 'SCHOOL_ADMIN']), importUsers);
router.get('/export/csv', authenticateToken, authorize(['SUPER_ADMIN', 'SCHOOL_ADMIN']), exportUsers);

export default router;













