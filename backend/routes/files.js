// files routes
const express = require('express');
const router = express.Router();

// GET /api/files
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'files endpoint working',
    data: []
  });
});

module.exports = router;