// dashboard routes
const express = require('express');
const router = express.Router();

// GET /api/dashboard
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'dashboard endpoint working',
    data: []
  });
});

module.exports = router;