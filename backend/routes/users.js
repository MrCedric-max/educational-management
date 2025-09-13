// users routes
const express = require('express');
const router = express.Router();

// GET /api/users
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'users endpoint working',
    data: []
  });
});

module.exports = router;