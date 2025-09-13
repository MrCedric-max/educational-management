// classes routes
const express = require('express');
const router = express.Router();

// GET /api/classes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'classes endpoint working',
    data: []
  });
});

module.exports = router;