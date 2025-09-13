// schools routes
const express = require('express');
const router = express.Router();

// GET /api/schools
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'schools endpoint working',
    data: []
  });
});

module.exports = router;