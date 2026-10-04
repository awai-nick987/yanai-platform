const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
  res.json({ submissions: [] });
});
router.post('/', (req, res) => {
  res.json({ id: 'sub-123', created: true });
});
router.put('/:id', (req, res) => {
  res.json({ id: req.params.id, updated: true });
});
router.delete('/:id', (req, res) => {
  res.json({ id: req.params.id, deleted: true });
});
module.exports = router;
