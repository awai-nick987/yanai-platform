const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
router.post('/login', (req, res) => {
  const token = jwt.sign({ user: 'test' }, process.env.JWT_SECRET || 'dev-key', { expiresIn: '24h' });
  res.json({ token });
});
router.post('/register', (req, res) => {
  res.json({ success: true });
});
router.post('/logout', (req, res) => {
  res.json({ success: true });
});
module.exports = router;
