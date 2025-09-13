// students routes
const express = require('express');
const router = express.Router();

// GET /api/students
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'students endpoint working',
    data: []
  });
});

module.exports = router;