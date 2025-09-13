// notifications routes
const express = require('express');
const router = express.Router();

// GET /api/notifications
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'notifications endpoint working',
    data: []
  });
});

module.exports = router;