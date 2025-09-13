// quizzes routes
const express = require('express');
const router = express.Router();

// GET /api/quizzes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'quizzes endpoint working',
    data: []
  });
});

module.exports = router;