const express = require('express');
const router = express.Router();
router.post('/upload', (req, res) => {
  res.json({ jobId: 'job-123', status: 'pending' });
});
router.get('/status/:jobId', (req, res) => {
  res.json({ jobId: req.params.jobId, status: 'processing', progress: 50 });
});
router.get('/results/:jobId', (req, res) => {
  res.json({ jobId: req.params.jobId, results: [] });
});
router.get('/history', (req, res) => {
  res.json({ jobs: [] });
});
router.delete('/cancel/:jobId', (req, res) => {
  res.json({ success: true });
});
module.exports = router;
