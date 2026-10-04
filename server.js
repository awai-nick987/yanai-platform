const express = require('express');
const cors = require('cors');
const config = require('./config/environment');
const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok' });
});
const PORT = config.PORT || 5001;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
module.exports = app;
