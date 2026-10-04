const express = require('express');
const router = express.Router();
const { getPool } = require('../config/database');
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ status: 'error', error: error.message });
  }
});
module.exports = router;
